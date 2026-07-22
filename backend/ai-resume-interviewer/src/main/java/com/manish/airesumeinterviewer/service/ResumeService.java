package com.manish.airesumeinterviewer.service;

import com.manish.airesumeinterviewer.dto.ResumeHistoryResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ResumeService {

    String uploadResume(MultipartFile file, String email)
            throws IOException;

    String analyzeResume(String email);

    List<ResumeHistoryResponse> getResumeHistory(String email);
}
