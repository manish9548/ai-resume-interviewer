package com.manish.airesumeinterviewer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {

    private Integer totalInterviews;

    private  Integer completedInterviews;

    private Double averageScore;

    private Integer bestScore;

    private String latestInterviewType;

    private long totalResumes;

}
