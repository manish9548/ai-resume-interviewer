package com.manish.airesumeinterviewer.service;

import org.springframework.stereotype.Service;

@Service
public class PromptServiceImpl implements PromptService {

    @Override
    public String getResumeAnalysisPrompt(String resumeText) {

        return """
You are an expert ATS Resume Reviewer.

Analyze the resume carefully.

Give score out of 100.

Identify strengths.

Identify weaknesses.

Identify missing technical skills.

Give practical suggestions.

IMPORTANT RULES:

1. Return ONLY valid JSON.
2. Do NOT return Markdown.
3. Do NOT use ```json.
4. Do NOT explain anything.
5. Do NOT write text before or after JSON.

Return this exact structure:

{
  "overallScore": 0,
  "strengths": [],
  "weaknesses": [],
  "missingSkills": [],
  "suggestions": []
}

Resume:

""" + resumeText;

    }

}