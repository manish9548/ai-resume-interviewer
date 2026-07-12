package com.manish.airesumeinterviewer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResumeHistoryResponse {
    private Long id;

    private String fileName;

    private LocalDateTime uploadedAt;


}
