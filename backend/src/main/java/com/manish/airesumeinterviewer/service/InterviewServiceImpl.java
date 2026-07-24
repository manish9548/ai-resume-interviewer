package com.manish.airesumeinterviewer.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.manish.airesumeinterviewer.dto.*;
import com.manish.airesumeinterviewer.entity.Interview;
import com.manish.airesumeinterviewer.entity.InterviewQuestion;
import com.manish.airesumeinterviewer.entity.Resume;
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
                        .company(interview.getCompany())
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
    public ResumeGapAnalysisResponse getResumeGapAnalysis(Long interviewId) {

        // Fetch Interview
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found"));

        // Fetch User
        User user = interview.getUser();

        // Fetch Latest Resume
        Resume resume = resumeRepository.findTopByUserOrderByUploadedAtDesc(user)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        // Resume Text
        String resumeText = resume.getExtractedText();

        if (resumeText == null || resumeText.isBlank()) {
            throw new RuntimeException("Resume text not found");
        }

        // Interview Questions
        List<InterviewQuestion> questions =
                interviewQuestionRepository.findByInterviewIdOrderByQuestionNumber(interviewId);

        if (questions.isEmpty()) {
            throw new RuntimeException("Interview questions not found");
        }

        // Prompt
        StringBuilder prompt = new StringBuilder();

        prompt.append("""
You are an expert technical interviewer and career mentor.

Compare the candidate's Resume with their Interview Performance.

Analyze:
1. Skills mentioned in the resume that were demonstrated in the interview.
2. Skills mentioned in the resume but NOT demonstrated in the interview.
3. Candidate's strengths.
4. Personalized improvement plan.

IMPORTANT:
Return ONLY valid JSON.
Do NOT use markdown.
Do NOT wrap the response inside ```json or ```.
Do NOT write any explanation.

Return exactly in this format:

{
  "matchedSkills":[
    "Skill 1",
    "Skill 2"
  ],
  "missingSkills":[
    "Skill 1",
    "Skill 2"
  ],
  "strengths":[
    "Point 1",
    "Point 2"
  ],
  "improvementPlan":[
    "Point 1",
    "Point 2"
  ]
}

Resume:

""");

        // Resume
        prompt.append(resumeText);

        // Interview Type
        prompt.append("\n\nInterview Type: ")
                .append(interview.getInterviewType())
                .append("\n\nInterview Questions and Answers:\n\n");

        // Questions
        for (InterviewQuestion q : questions) {

            prompt.append("""
Question:
%s

Answer:
%s

Score:
%s

"""
                    .formatted(
                            q.getQuestion(),
                            q.getAnswer() == null ? "Not Answered" : q.getAnswer(),
                            q.getScore() == null ? 0 : q.getScore()
                    ));
        }

        // Gemini Response
        String response = geminiService.generateContent(prompt.toString());

        // Remove Markdown
        response = response
                .replace("```json", "")
                .replace("```", "")
                .trim();

        // Extract JSON
        int start = response.indexOf("{");
        int end = response.lastIndexOf("}");

        if (start == -1 || end == -1) {
            throw new RuntimeException("Invalid Gemini response: " + response);
        }

        response = response.substring(start, end + 1);

        System.out.println(response);

        // Convert JSON -> DTO
        try {

            ObjectMapper mapper = new ObjectMapper();

            return mapper.readValue(
                    response,
                    ResumeGapAnalysisResponse.class
            );

        } catch (JsonProcessingException e) {

            throw new RuntimeException(
                    "Failed to parse Gemini response",
                    e
            );
        }
    }
    @Override
    public RoadmapResponse getLearningRoadmap(Long interviewId) {

        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found"));

        User user = interview.getUser();

        Resume resume = resumeRepository.findTopByUserOrderByUploadedAtDesc(user)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        String resumeText = resume.getExtractedText();

        if (resumeText == null || resumeText.isBlank()) {
            throw new RuntimeException("Resume text not found");
        }

        List<InterviewQuestion> questions =
                interviewQuestionRepository.findByInterviewIdOrderByQuestionNumber(interviewId);

        if (questions.isEmpty()) {
            throw new RuntimeException("Interview questions not found");
        }

        StringBuilder prompt = new StringBuilder();

        prompt.append("""
You are an expert Java mentor, technical interviewer, and career coach.

Analyze the candidate's Resume and Interview Performance.

Your task is to generate a personalized 30-Day Learning Roadmap.

The roadmap should focus on:

1. Weak topics found during the interview.
2. Skills missing from the interview.
3. Resume strengths that should be improved further.
4. Interview preparation.
5. Small practical tasks.
6. Gradually increase the difficulty every week.

IMPORTANT:

Return ONLY valid JSON.

Do NOT use markdown.

Do NOT wrap the response inside ```json or ```.

Do NOT write any explanation.

Return exactly in this format:

{
  "roadmapTitle":"30-Day Java Learning Roadmap",
  "week1":[
    "Task 1",
    "Task 2",
    "Task 3"
  ],
  "week2":[
    "Task 1",
    "Task 2",
    "Task 3"
  ],
  "week3":[
    "Task 1",
    "Task 2",
    "Task 3"
  ],
  "week4":[
    "Task 1",
    "Task 2",
    "Task 3"
  ]
}

Resume:

""");

        prompt.append(resumeText);

        prompt.append("""

Interview Type:
""")
                .append(interview.getInterviewType())
                .append("""

Interview Questions and Answers:

""");

        for (InterviewQuestion q : questions) {

            prompt.append("""
Question:
%s

Answer:
%s

Score:
%s

"""
                    .formatted(
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

            return mapper.readValue(response, RoadmapResponse.class);

        } catch (JsonProcessingException e) {

            throw new RuntimeException("Failed to parse Gemini response", e);

        }
    }
    @Override
    public void submitAnswer(Long questionId, String answer) {

        InterviewQuestion question = interviewQuestionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        question.setAnswer(answer);

        String prompt = """
You are a Senior Technical Interviewer with 15+ years of experience hiring Fresher Java Developers.

Your task is to evaluate the candidate's answer fairly.

IMPORTANT:

The candidate is a FRESHER.

Do NOT expect perfect textbook definitions.

Reward understanding of concepts.

Minor spelling mistakes, grammar mistakes, or missing examples should NOT heavily reduce marks.

Evaluate based on:

1. Concept Understanding
2. Technical Accuracy
3. Completeness
4. Communication

--------------------------------

SCORING RULES

10 = Excellent answer with correct explanation and examples.

9 = Very good answer with tiny mistakes.

8 = Good answer with correct concept but missing minor details.

7 = Correct concept but explanation is short.

6 = Basic understanding with correct idea.

5 = Partial understanding.

4 = Some correct points but mostly incomplete.

3 = Very limited understanding.

2 = Wrong concept but tried to answer.

1 = Completely incorrect.

0 = Empty answer.

--------------------------------

Examples

Example 1

Question:
What are the four pillars of OOP?

Candidate:
Encapsulation
Inheritance
Abstraction
Polymorphism

Score:
7

Feedback:
Good understanding of the concepts.
You correctly identified all four pillars.
Add explanations and examples.

--------------------------------

Example 2

Question:
Difference between ArrayList and LinkedList

Candidate:
ArrayList uses array.
LinkedList uses nodes.

Score:
6

Feedback:
Correct basic understanding.
Explain complexity and use cases.

--------------------------------

Example 3

Question:
What is Dependency Injection?

Candidate:
Spring automatically creates and injects objects using @Autowired.

Score:
7

Feedback:
Correct idea.
Explain Inversion of Control and benefits.

--------------------------------

Now evaluate this interview answer.

Question:

%s

Candidate Answer:

%s

Return ONLY valid JSON.

Format:

{
  "score":7,
  "feedback":"Explain why the score was given in simple English. Maximum 80 words.",
  "idealAnswer":"Provide an interview-ready answer within 100 words. Do NOT generate Java code."
}

Rules:

Return JSON only.

Do NOT use markdown.

Do NOT use ```json.

Do NOT generate Java code.

Do NOT generate long paragraphs.

Do NOT explain outside JSON.
""".formatted(
                question.getQuestion(),
                answer
        );

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
    public String startInterview(
            StartInterviewRequest request,
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Resume resume = resumeRepository.findTopByUserOrderByUploadedAtDesc(user)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        String resumeText = resume.getExtractedText();

        if (resumeText == null || resumeText.isBlank()) {
            throw new RuntimeException("Resume text not found");
        }

        String prompt = """
You are an experienced technical interviewer working at %s.

Generate exactly 10 interview questions.

Interview Type:
%s

Target Company:
%s

Rules:

- Questions must match the interview style of %s.
- Difficulty should be appropriate for freshers.
- Cover important topics of the selected interview type.
- Do not ask MCQs.
- Do not repeat questions.

IMPORTANT:

Return ONLY a valid JSON array.

Example:

[
  "What is JVM?",
  "Explain the difference between HashMap and ConcurrentHashMap.",
  "What is Dependency Injection?"
]

Do NOT number the questions.
Do NOT use markdown.
Do NOT wrap the response inside ```json or ```.
Do NOT write any explanation.
Return exactly 10 questions.

Resume:

%s
""".formatted(
                request.getCompany(),
                request.getInterviewType(),
                request.getCompany(),
                request.getCompany(),
                resumeText
        );

        String response = geminiService.generateContent(prompt);

        System.out.println("========== GEMINI RESPONSE ==========");
        System.out.println(response);
        System.out.println("=====================================");

        response = response
                .replace("```json", "")
                .replace("```", "")
                .trim();

        List<String> questionList;

        try {

            ObjectMapper mapper = new ObjectMapper();

            questionList = mapper.readValue(
                    response,
                    new TypeReference<List<String>>() {
                    });

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to parse Gemini response:\n" + response,
                    e
            );
        }

        Interview interview = Interview.builder()
                .interviewType(request.getInterviewType())
                .company(request.getCompany())
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

        return "Interview Started Successfully. Interview ID: " + interview.getId();
    }



}