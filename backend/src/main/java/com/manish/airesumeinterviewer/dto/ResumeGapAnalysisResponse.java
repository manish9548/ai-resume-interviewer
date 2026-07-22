package com.manish.airesumeinterviewer.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeGapAnalysisResponse {
    private List<String> matchedSkills;

    private List<String> missingSkills;

    private List<String> strengths;

    private List<String> improvementPlan;

}
