package com.manish.airesumeinterviewer.controller;

import com.manish.airesumeinterviewer.dto.*;
import com.manish.airesumeinterviewer.service.InterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interview")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;



    @PostMapping("/start")
    public String startInterview(
            @RequestParam String type,
            Authentication authentication
    ) {

        return interviewService.startInterview(
                type,
                authentication.getName()
        );
    }
    @GetMapping("/{interviewId}/questions")
    public List<InterviewQuestionResponse> getQuestions(
            @PathVariable Long interviewId
    ) {
        return interviewService.getInterviewQuestions(interviewId);
    }

    @PostMapping("/question/{questionId}/answer")
    public String submitAnswer(
            @PathVariable Long questionId,
            @RequestBody AnswerRequest request
    ){
        interviewService.submitAnswer(questionId,request.getAnswer());
        return "Answer Saved Successfully";
    }
    @PostMapping("/question/{questionId}/skip")
    public String skipQuestion(
            @PathVariable Long questionId
    ) {

        interviewService.skipQuestion(questionId);

        return "Question Skipped Successfully";
    }
    @GetMapping("/history")
    public List<InterviewHistoryResponse> getHistory(
            Authentication authentication
    ) {
        return interviewService.getInterviewHistory(
                authentication.getName()
        );
    }
    @PostMapping("/{interviewId}/finish")
    public InterviewResultResponse finishInterview(
            @PathVariable Long interviewId
    ){
        return interviewService.finishInterview(interviewId);
    }
    @GetMapping("/question/{questionId}/evaluation")
    public EvaluationResponse getEvaluation(
            @PathVariable Long questionId
    ) {
        return interviewService.getEvaluation(questionId);
    }
    @GetMapping("/{interviewId}/report")
    public InterviewReportResponse getInterviewReport(
            @PathVariable Long interviewId
    ) {
        return interviewService.getInterviewReport(interviewId);
    }
}