package com.manish.airesumeinterviewer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OverallFeedbackResponse {
    private String overallRating;

    private String summary;

    private List<String> strengths;

    private List<String> weaknesses;

    private List<String> suggestions;
}
