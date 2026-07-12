package com.manish.airesumeinterviewer.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.manish.airesumeinterviewer.dto.*;
import com.manish.airesumeinterviewer.entity.Interview;
import com.manish.airesumeinterviewer.entity.InterviewQuestion;
import com.manish.airesumeinterviewer.entity.User;
import com.manish.airesumeinterviewer.repository.InterviewQuestionRepository;
import com.manish.airesumeinterviewer.repository.InterviewRepository;
import com.manish.airesumeinterviewer.repository.ResumeRepository;
import com.manish.airesumeinterviewer.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InterviewServiceImpl implements InterviewService {

    private final InterviewRepository interviewRepository;
    private final InterviewQuestionRepository interviewQuestionRepository;
    private final UserRepository userRepository;
    private final GeminiService geminiService;
    private final ObjectMapper objectMapper;
    private final ResumeRepository resumeRepository;
    @Override
    public List<InterviewQuestionResponse> getInterviewQuestions(Long interviewId) {

        return interviewQuestionRepository
                .findByInterviewIdOrderByQuestionNumber(interviewId)
                .stream()
                .map(question -> InterviewQuestionResponse.builder()
                        .id(question.getId())
                        .questionNumber(question.getQuestionNumber())
                        .question(question.getQuestion())
                        .skipped(question.getSkipped())
                        .build())
                .toList();
    }
    @Override
    public InterviewReportResponse getInterviewReport(Long interviewId) {

        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found"));

        List<InterviewQuestion> questions =
                interviewQuestionRepository.findByInterviewIdOrderByQuestionNumber(interviewId);

        List<InterviewReportQuestion> reportQuestions = questions.stream()
                .map(question -> InterviewReportQuestion.builder()
                        .questionNumber(question.getQuestionNumber())
                        .question(question.getQuestion())
                        .answer(question.getAnswer())
                        .score(question.getScore())
                        .feedback(question.getFeedback())
                        .idealAnswer(question.getIdealAnswer())
                        .skipped(question.getSkipped())
                        .build())
                .toList();

        return InterviewReportResponse.builder()
                .interviewId(interview.getId())
                .interviewType(interview.getInterviewType())
                .totalScore(interview.getOverallScore())
                .percentage(
                        questions.isEmpty()
                                ? 0
                                : (interview.getOverallScore() * 100.0)
                                / (questions.size() * 10)
                )
                .status(interview.getStatus())
                .questions(reportQuestions)
                .build();
    }
    @Override
    public List<InterviewHistoryResponse> getInterviewHistory(String email) {

        List<Interview> interviews =
                interviewRepository.findByUserEmailOrderByCreatedAtDesc(email);

        return interviews.stream()
                .map(interview -> InterviewHistoryResponse.builder()
                        .interviewId(interview.getId())
                        .interviewType(interview.getInterviewType())
                        .totalScore(interview.getOverallScore())
                        .percentage(
                                interview.getOverallScore() == null
                                        ? 0
                                        : (interview.getOverallScore() / 100.0) * 100
                        )
                        .status(interview.getStatus())
                        .createdAt(interview.getCreatedAt())
                        .build()
                )
                .toList();
    }
    @Override
    public void skipQuestion(Long questionId) {

        InterviewQuestion question = interviewQuestionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        // agar by chance already submit hai to fir re submit na ho
        if (question.getAnswer() != null) {
            throw new RuntimeException("Question already answered");
        }

        question.setSkipped(true);

        interviewQuestionRepository.save(question);
    }
    @Override
    public DashboardResponse getDashboard(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        long totalResumes = resumeRepository.countByUser(user);

        List<Interview> interviews =
                interviewRepository.findByUserEmailOrderByCreatedAtDesc(email);

        int totalInterviews = interviews.size();

        int completedInterviews = (int) interviews.stream()
                .filter(i -> "COMPLETED".equals(i.getStatus()))
                .count();

        double averageScore = interviews.stream()
                .filter(i -> i.getOverallScore() != null)
                .mapToInt(Interview::getOverallScore)
                .average()
                .orElse(0.0);

        int bestScore = interviews.stream()
                .filter(i -> i.getOverallScore() != null)
                .mapToInt(Interview::getOverallScore)
                .max()
                .orElse(0);

        String latestInterviewType = interviews.isEmpty()
                ? null
                : interviews.get(0).getInterviewType();

        return DashboardResponse.builder()
                .totalResumes(totalResumes)
                .totalInterviews(totalInterviews)
                .completedInterviews(completedInterviews)
                .averageScore(averageScore)
                .bestScore(bestScore)
                .latestInterviewType(latestInterviewType)
                .build();
    }
    @Override
    public EvaluationResponse getEvaluation(Long questionId) {

        InterviewQuestion question = interviewQuestionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        return EvaluationResponse.builder()
                .score(question.getScore())
                .feedback(question.getFeedback())
                .idealAnswer(question.getIdealAnswer())
                .build();
    }
    @Override
    public void submitAnswer(Long questionId, String answer) {

        InterviewQuestion question = interviewQuestionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        question.setAnswer(answer);

        String prompt = """
You are an expert technical interviewer.

Evaluate the candidate's answer.

Question:
%s

Candidate Answer:
%s

Return ONLY valid JSON.

{
  "score": 8,
  "feedback": "Good answer but missing some important points.",
  "idealAnswer": "A complete answer should explain..."
}

Do not add markdown.
Do not add explanation.
Do not write ```json.
Return JSON only.
""".formatted(question.getQuestion(), answer);

        String response = geminiService.generateContent(prompt);

        try {

            EvaluationResponse evaluation = objectMapper.readValue(
                    response,
                    EvaluationResponse.class
            );

            question.setScore(evaluation.getScore());
            question.setFeedback(evaluation.getFeedback());
            question.setIdealAnswer(evaluation.getIdealAnswer());

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Gemini response");
        }

        interviewQuestionRepository.save(question);
    }
    @Override
    public InterviewResultResponse finishInterview(Long interviewId) {

        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found"));

        List<InterviewQuestion> questions =
                interviewQuestionRepository.findByInterviewIdOrderByQuestionNumber(interviewId);

        int totalScore = questions.stream()
                .mapToInt(q -> q.getScore() == null ? 0 : q.getScore())
                .sum();

        double percentage = questions.isEmpty()
                ? 0
                : (totalScore / (questions.size() * 10.0)) * 100;

        interview.setOverallScore(totalScore);
        interview.setStatus("COMPLETED");
        interview.setCompletedAt(LocalDateTime.now());

        interviewRepository.save(interview);

        return InterviewResultResponse.builder()
                .interviewId(interviewId)
                .totalScore(totalScore)
                .totalQuestions(questions.size())
                .percentage(percentage)
                .status(interview.getStatus())
                .build();
    }
    @Override
    public OverallFeedbackResponse getOverallFeedback(Long interviewId) {

        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found"));

        List<InterviewQuestion> questions =
                interviewQuestionRepository.findByInterviewIdOrderByQuestionNumber(interviewId);
        if (questions.isEmpty()) {
            throw new RuntimeException("No questions found for this interview.");
        }

        StringBuilder prompt = new StringBuilder();

        prompt.append("""
You are an expert technical interviewer.

Analyze the complete interview.

Return ONLY valid JSON.

{
  "overallRating":"Excellent",
  "summary":"Overall interview summary",
  "strengths":[
    "Point 1",
    "Point 2"
  ],
  "weaknesses":[
    "Point 1",
    "Point 2"
  ],
  "suggestions":[
    "Point 1",
    "Point 2"
  ]
}

Interview Details:

""");

        for (InterviewQuestion q : questions){

            prompt.append("""
Question:
%s

Answer:
%s

Score:
%s

""".formatted(
                    q.getQuestion(),
                    q.getAnswer(),
                    q.getScore()
            ));
        }

        String response = geminiService.generateContent(prompt.toString());

        response = response
                .replace("```json", "")
                .replace("```", "")
                .trim();

        int start = response.indexOf("{");
        int end = response.lastIndexOf("}");

        if (start == -1 || end == -1) {
            throw new RuntimeException("Invalid Gemini response: " + response);
        }

        response = response.substring(start, end + 1);

        System.out.println(response);

        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(response, OverallFeedbackResponse.class);

        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to parse Gemini response", e);
        }



    }

    @Override
    public String startInterview(String type, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String prompt = """
                You are an expert interviewer.

                Generate exactly 10 interview questions.

                Interview Type: %s

                Return ONLY a JSON array.

                Example:

                [
                  "What is Java?",
                  "Explain OOP.",
                  "What is JVM?"
                ]

                Rules:
                - Return exactly 10 questions.
                - No numbering.
                - No markdown.
                - No explanation.
                - No ```json.
                - Return valid JSON only.
                """.formatted(type);

        String response = geminiService.generateContent(prompt);

        List<String> questionList;

        try {
            questionList = objectMapper.readValue(
                    response,
                    new TypeReference<List<String>>() {
                    }
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Gemini response", e);
        }

        Interview interview = Interview.builder()
                .interviewType(type)
                .status("IN_PROGRESS")
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();

        interviewRepository.save(interview);

        List<InterviewQuestion> interviewQuestions = new ArrayList<>();

        for (int i = 0; i < questionList.size(); i++) {

            interviewQuestions.add(
                    InterviewQuestion.builder()
                            .interview(interview)
                            .questionNumber(i + 1)
                            .question(questionList.get(i))
                            .skipped(false)
                            .build()
            );
        }

        interviewQuestionRepository.saveAll(interviewQuestions);

        try {
            return objectMapper.writeValueAsString(questionList);
        } catch (Exception e) {
            return response;
        }
    }
}