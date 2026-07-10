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
public class InterviewReportResponse {
    private Long interviewId;

    private String interviewType;

    private Integer totalScore;

    private Double percentage;

    private String status;

    private List<InterviewReportQuestion> questions;
}
