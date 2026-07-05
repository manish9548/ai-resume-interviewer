package com.manish.airesumeinterviewer.service;

import com.manish.airesumeinterviewer.entity.Resume;
import com.manish.airesumeinterviewer.entity.User;
import com.manish.airesumeinterviewer.parser.ResumeParser;
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
    private final ResumeParser resumeParser;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Override
    public String uploadResume(MultipartFile file, String email)
            throws IOException {

        // Empty file check
        if (file.isEmpty()) {
            throw new RuntimeException("Please upload a file.");
        }

        // Only PDF allowed
        if (!"application/pdf".equals(file.getContentType())) {
            throw new RuntimeException("Only PDF files are allowed.");
        }

        // Find logged-in user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        // Create uploads folder if it doesn't exist
        File uploadFolder = new File(uploadDir);

        if (!uploadFolder.exists()) {
            uploadFolder.mkdirs();
        }

        // Original file name
        String fileName = file.getOriginalFilename();

        // Destination file
        File destination = new File(uploadFolder, fileName);

        // Save file
        file.transferTo(destination);

        // Extract PDF text
        String extractedText = resumeParser.extractText(destination);

        // Save metadata in database
        Resume resume = Resume.builder()
                .fileName(fileName)
                .filePath(destination.getAbsolutePath())
                .uploadedAt(LocalDateTime.now())
                .extractedText(extractedText)
                .user(user)
                .build();

        resumeRepository.save(resume);

        return "Resume Uploaded Successfully";
    }
}