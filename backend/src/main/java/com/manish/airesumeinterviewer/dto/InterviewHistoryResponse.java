package com.manish.airesumeinterviewer.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InterviewHistoryResponse {
    private Long interviewId;

    private String interviewType;

    private String company;

    private Integer totalScore;

    private Double percentage;

    private String status;

    private LocalDateTime createdAt;

}
