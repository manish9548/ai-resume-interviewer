package com.manish.airesumeinterviewer.controller;

import com.manish.airesumeinterviewer.dto.*;
import com.manish.airesumeinterviewer.service.InterviewService;
import com.manish.airesumeinterviewer.service.PdfReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interview")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;
    @Autowired
    private PdfReportService pdfReportService;
    @GetMapping("/{interviewId}/report/pdf")
    public ResponseEntity<byte[]> downloadReport(
            @PathVariable Long interviewId) {

        byte[] pdf = pdfReportService.generateInterviewReport(interviewId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=Interview_Report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);

    }

    @PostMapping("/start")
    public String startInterview(
            @RequestBody StartInterviewRequest request,
            Authentication authentication
    ) {

        return interviewService.startInterview(
                request,
                authentication.getName()
        );
    }
    @GetMapping("/{interviewId}/questions")
    public List<InterviewQuestionResponse> getQuestions(
            @PathVariable Long interviewId
    ) {
        return interviewService.getInterviewQuestions(interviewId);
    }

    @PostMapping("/question/{questionId}/answer")
    public String submitAnswer(
            @PathVariable Long questionId,
            @RequestBody AnswerRequest request
    ){
        interviewService.submitAnswer(questionId,request.getAnswer());
        return "Answer Saved Successfully";
    }
    @PostMapping("/question/{questionId}/skip")
    public String skipQuestion(
            @PathVariable Long questionId
    ) {

        interviewService.skipQuestion(questionId);

        return "Question Skipped Successfully";
    }
    @GetMapping("/history")
    public List<InterviewHistoryResponse> getHistory(
            Authentication authentication
    ) {
        return interviewService.getInterviewHistory(
                authentication.getName()
        );
    }
    @PostMapping("/{interviewId}/finish")
    public InterviewResultResponse finishInterview(
            @PathVariable Long interviewId
    ){
        return interviewService.finishInterview(interviewId);
    }
    @GetMapping("/question/{questionId}/evaluation")
    public EvaluationResponse getEvaluation(
            @PathVariable Long questionId
    ) {
        return interviewService.getEvaluation(questionId);
    }
    @GetMapping("/{interviewId}/report")
    public InterviewReportResponse getInterviewReport(
            @PathVariable Long interviewId
    ) {
        return interviewService.getInterviewReport(interviewId);
    }
    @GetMapping("/dashboard")
    public DashboardResponse getDashboard(
            Authentication authentication
    ) {
        return interviewService.getDashboard(
                authentication.getName()
        );
    }
    @GetMapping("/{interviewId}/overall-feedback")
    public OverallFeedbackResponse getOverallFeedback(
            @PathVariable Long interviewId
    ){
        return interviewService.getOverallFeedback(interviewId);
    }
    @GetMapping("/{interviewId}/resume-gap-analysis")
    public ResponseEntity<ResumeGapAnalysisResponse> getResumeGapAnalysis(
            @PathVariable Long interviewId){

        return ResponseEntity.ok(
                interviewService.getResumeGapAnalysis(interviewId)
        );
    }
    @GetMapping("/{interviewId}/roadmap")
    public ResponseEntity<RoadmapResponse> getLearningRoadmap(
            @PathVariable Long interviewId){

        return ResponseEntity.ok(
                interviewService.getLearningRoadmap(interviewId)
        );
    }

}