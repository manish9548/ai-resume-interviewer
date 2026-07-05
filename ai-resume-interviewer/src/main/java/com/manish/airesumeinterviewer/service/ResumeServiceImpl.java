package com.manish.airesumeinterviewer.service;

import com.manish.airesumeinterviewer.entity.Resume;
import com.manish.airesumeinterviewer.entity.User;
import com.manish.airesumeinterviewer.repository.ResumeRepository;
import com.manish.airesumeinterviewer.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ResumeServiceImpl implements ResumeService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Override
    public String uploadResume(MultipartFile file, String email)
            throws IOException {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        String fileName = file.getOriginalFilename();

        File uploadFolder = new File(uploadDir);

        if (!uploadFolder.exists()) {
            uploadFolder.mkdirs();
        }

        File destination = new File(uploadFolder, fileName);

        file.transferTo(destination);

        Resume resume = Resume.builder()
                .fileName(fileName)
                .filePath(destination.getAbsolutePath())
                .uploadedAt(LocalDateTime.now())
                .user(user)
                .build();

        resumeRepository.save(resume);

        return "Resume Uploaded Successfully";
    }
}