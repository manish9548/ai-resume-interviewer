package com.manish.airesumeinterviewer.service;

import com.manish.airesumeinterviewer.dto.*;

import java.util.List;

public interface InterviewService {
    String startInterview(String type, String email);
    List<InterviewQuestionResponse> getInterviewQuestions(Long interviewId);
    void submitAnswer(Long questionId, String answer);
    InterviewResultResponse finishInterview(Long interviewId);
    EvaluationResponse getEvaluation(Long questionId);
    InterviewReportResponse getInterviewReport(Long interviewId);
    void skipQuestion(Long questionId);
    List<InterviewHistoryResponse> getInterviewHistory(String email);
    DashboardResponse getDashboard(String email);
}
