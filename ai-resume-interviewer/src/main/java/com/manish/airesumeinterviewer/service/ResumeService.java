package com.manish.airesumeinterviewer.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ResumeService {

    String uploadResume(MultipartFile file, String email)
            throws IOException;

}
