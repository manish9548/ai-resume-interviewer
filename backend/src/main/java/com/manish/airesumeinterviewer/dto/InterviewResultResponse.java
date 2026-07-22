package com.manish.airesumeinterviewer.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InterviewResultResponse {
    private Long interviewId;

    private Integer totalScore;

    private Integer totalQuestions;

    private Double percentage;

    private String status;

}
