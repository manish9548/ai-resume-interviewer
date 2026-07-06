package com.manish.airesumeinterviewer.service;

import org.springframework.stereotype.Service;

@Service
public class PromptServiceImpl implements PromptService {


    @Override
    public String getResumeAnalysisPrompt(String resumeText) {

        return """
                You are an expert ATS Resume Reviewer.

                Analyze the following resume carefully.

                Return the response in the following format:

                1. Professional Summary

                2. Technical Skills

                3. Strengths

                4. Weaknesses

                5. Missing Skills

                6. ATS Score (0-100)

                7. Top 10 Technical Interview Questions

                Resume:

                """ + resumeText;
    }
}