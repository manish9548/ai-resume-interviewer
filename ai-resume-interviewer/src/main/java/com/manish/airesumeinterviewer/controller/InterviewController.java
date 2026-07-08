package com.manish.airesumeinterviewer.controller;

import com.manish.airesumeinterviewer.dto.AnswerRequest;
import com.manish.airesumeinterviewer.dto.InterviewQuestionResponse;
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
}