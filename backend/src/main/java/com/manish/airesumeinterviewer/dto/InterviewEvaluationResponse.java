package com.manish.airesumeinterviewer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InterviewEvaluationResponse {

    private Integer questionNumber;

    private Integer score;

    private String feedback;

    private String idealAnswer;

}