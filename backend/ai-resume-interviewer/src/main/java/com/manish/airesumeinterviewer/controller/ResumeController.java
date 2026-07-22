package com.manish.airesumeinterviewer.controller;


import com.manish.airesumeinterviewer.dto.ResumeHistoryResponse;
import com.manish.airesumeinterviewer.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping("/upload")
    public String uploadResume(@RequestParam("file")MultipartFile file,
                               Authentication authentication
    ) throws IOException{
        return resumeService.uploadResume(
                file,
                authentication.getName()
        );
    }
    @GetMapping("/analyze")
    public String analyzeResume(Authentication authentication) {

        return resumeService.analyzeResume(authentication.getName());

    }
    @GetMapping("/history")
    public List<ResumeHistoryResponse> getResumeHistory(
            Authentication authentication
    ){

        return resumeService.getResumeHistory(
                authentication.getName()
        );
    }

}

