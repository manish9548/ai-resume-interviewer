package com.manish.airesumeinterviewer.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EvaluationResponse {
    private  Integer score;
    private  String feedback;
    private  String idealAnswer;
}
