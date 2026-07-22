package com.manish.airesumeinterviewer.service;

public interface PdfReportService {
    byte[] generateInterviewReport(Long interviewId);
}
