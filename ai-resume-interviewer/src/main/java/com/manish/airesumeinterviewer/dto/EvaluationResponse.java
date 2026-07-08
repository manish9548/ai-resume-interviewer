package com.manish.airesumeinterviewer.dto;


import lombok.Data;

@Data
public class EvaluationResponse {
    private  Integer score;
    private  String feedback;
    private  String idealAnswer;
}
