package com.manish.airesumeinterviewer.service;

import com.manish.airesumeinterviewer.entity.Interview;
import com.manish.airesumeinterviewer.entity.User;
import com.manish.airesumeinterviewer.repository.InterviewRepository;
import com.manish.airesumeinterviewer.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class InterviewServiceImpl implements InterviewService {

    private final InterviewRepository interviewRepository;
    private final UserRepository userRepository;
    private final GeminiService geminiService;

    @Override
    public String startInterview(String type, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String prompt = """
                You are an expert interviewer.

                Generate 10 interview questions.

                Interview Type: %s

                Return only the questions.

                Number them from 1 to 10.

                Do not provide answers.
                """.formatted(type);

        String questions = geminiService.generateContent(prompt);

        Interview interview = Interview.builder()
                .interviewType(type)
                .questions(questions)
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();

        interviewRepository.save(interview);

        return questions;
    }
}