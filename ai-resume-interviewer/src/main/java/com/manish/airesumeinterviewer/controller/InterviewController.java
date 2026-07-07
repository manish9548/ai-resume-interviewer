package com.manish.airesumeinterviewer.controller;

import com.manish.airesumeinterviewer.service.InterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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
}