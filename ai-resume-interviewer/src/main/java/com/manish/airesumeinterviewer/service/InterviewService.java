package com.manish.airesumeinterviewer.service;

import com.manish.airesumeinterviewer.dto.EvaluationResponse;
import com.manish.airesumeinterviewer.dto.InterviewQuestionResponse;
import com.manish.airesumeinterviewer.dto.InterviewResultResponse;

import java.util.List;

public interface InterviewService {
    String startInterview(String type, String email);
    List<InterviewQuestionResponse> getInterviewQuestions(Long interviewId);
    void submitAnswer(Long questionId, String answer);
    InterviewResultResponse finishInterview(Long interviewId);
    EvaluationResponse getEvaluation(Long questionId);
}
