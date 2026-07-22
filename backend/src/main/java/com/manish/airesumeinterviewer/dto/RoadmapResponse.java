package com.manish.airesumeinterviewer.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoadmapResponse {
    private String roadmapTitle;

    private List<String> week1;

    private List<String> week2;

    private List<String> week3;

    private List<String> week4;
}
