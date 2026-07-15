package com.manish.airesumeinterviewer.service;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import com.manish.airesumeinterviewer.dto.InterviewReportResponse;
import com.manish.airesumeinterviewer.dto.OverallFeedbackResponse;
import com.manish.airesumeinterviewer.dto.ResumeGapAnalysisResponse;
import com.manish.airesumeinterviewer.dto.RoadmapResponse;
import com.manish.airesumeinterviewer.entity.Interview;
import com.manish.airesumeinterviewer.entity.InterviewQuestion;
import com.manish.airesumeinterviewer.repository.InterviewQuestionRepository;
import com.manish.airesumeinterviewer.repository.InterviewRepository;
import com.manish.airesumeinterviewer.service.PdfReportService;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
public class PdfReportServiceImpl implements PdfReportService {
    private final InterviewRepository interviewRepository;
    private final InterviewQuestionRepository interviewQuestionRepository;
    private final InterviewService interviewService;

    @Override
    public byte[] generateInterviewReport(Long interviewId) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found"));

        List<InterviewQuestion> questions =
                interviewQuestionRepository.findByInterviewIdOrderByQuestionNumber(interviewId);

        InterviewReportResponse report =
                interviewService.getInterviewReport(interviewId);

        OverallFeedbackResponse feedback =
                interviewService.getOverallFeedback(interviewId);

        ResumeGapAnalysisResponse gap =
                interviewService.getResumeGapAnalysis(interviewId);

        RoadmapResponse roadmap =
                interviewService.getLearningRoadmap(interviewId);

        try {

            ByteArrayOutputStream out = new ByteArrayOutputStream();

            Document document = new Document();

            PdfWriter.getInstance(document, out);

            document.open();



            document.add(new Paragraph(
                    "Candidate : " +
                            interview.getUser().getName()));

            document.add(new Paragraph(
                    "Interview Type : " +
                            interview.getInterviewType()));

            document.add(new Paragraph(
                    "Date : " +
                            interview.getCreatedAt()));

            document.add(new Paragraph(
                    "Total Score : " +
                            report.getTotalScore()));

            document.add(new Paragraph(" "));

            document.close();

            return out.toByteArray();

        } catch (DocumentException e) {

            throw new RuntimeException("Failed to generate PDF", e);

        }

    }

}
