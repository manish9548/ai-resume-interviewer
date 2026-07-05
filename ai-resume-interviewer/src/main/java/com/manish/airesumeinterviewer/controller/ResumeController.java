package com.manish.airesumeinterviewer.controller;


import com.manish.airesumeinterviewer.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

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

}
