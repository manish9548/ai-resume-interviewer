package com.manish.airesumeinterviewer.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InterviewReportQuestion {
    private Integer questionNumber;

    private String question;

    private String answer;

    private Integer score;

    private String feedback;

    private String idealAnswer;

    private Boolean skipped;

}
