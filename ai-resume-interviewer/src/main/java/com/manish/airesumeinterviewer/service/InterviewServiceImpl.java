package com.manish.airesumeinterviewer.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.manish.airesumeinterviewer.dto.EvaluationResponse;
import com.manish.airesumeinterviewer.dto.InterviewQuestionResponse;
import com.manish.airesumeinterviewer.entity.Interview;
import com.manish.airesumeinterviewer.entity.InterviewQuestion;
import com.manish.airesumeinterviewer.entity.User;
import com.manish.airesumeinterviewer.repository.InterviewQuestionRepository;
import com.manish.airesumeinterviewer.repository.InterviewRepository;
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