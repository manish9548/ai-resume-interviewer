package com.manish.airesumeinterviewer.service;

import com.manish.airesumeinterviewer.dto.InterviewQuestionResponse;

import java.util.List;

public interface InterviewService {
    String startInterview(String type, String email);
    List<InterviewQuestionResponse> getInterviewQuestions(Long interviewId);
    void submitAnswer(Long questionId, String answer);
}
