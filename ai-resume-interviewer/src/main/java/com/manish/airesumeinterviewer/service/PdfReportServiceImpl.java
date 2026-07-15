package com.manish.airesumeinterviewer.service;

import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.PageSize;
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
import lombok.RequiredArgsConstructor;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.Phrase;
import com.lowagie.text.Element;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PdfReportServiceImpl implements PdfReportService {

    private final InterviewRepository interviewRepository;
    private final InterviewQuestionRepository interviewQuestionRepository;
    private final InterviewService interviewService;

    @Override
    public byte[] generateInterviewReport(Long interviewId) {

        // Fetch Interview
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found"));

        // Fetch Questions
        List<InterviewQuestion> questions =
                interviewQuestionRepository.findByInterviewIdOrderByQuestionNumber(interviewId);

        // Fetch Report Data
        InterviewReportResponse report =
                interviewService.getInterviewReport(interviewId);

        OverallFeedbackResponse feedback =
                interviewService.getOverallFeedback(interviewId);

        ResumeGapAnalysisResponse gap =
                interviewService.getResumeGapAnalysis(interviewId);

        RoadmapResponse roadmap =
                interviewService.getLearningRoadmap(interviewId);

        // Fonts
        Font titleFont = new Font(Font.HELVETICA, 20, Font.BOLD);
        Font headingFont = new Font(Font.HELVETICA, 15, Font.BOLD);
        Font normalFont = new Font(Font.HELVETICA, 11);
        Font boldFont = new Font(Font.HELVETICA, 11, Font.BOLD);

        try {

            ByteArrayOutputStream out = new ByteArrayOutputStream();

            Document document = new Document(PageSize.A4);

            PdfWriter.getInstance(document, out);

            document.open();

            // ===========================
            // TITLE
            // ===========================

            Paragraph title = new Paragraph(
                    "AI Resume Interview Report",
                    titleFont
            );

            title.setAlignment(Paragraph.ALIGN_CENTER);

            document.add(title);
            document.add(new Paragraph(" "));

            // ===========================
            // CANDIDATE DETAILS
            // ===========================

            document.add(new Paragraph("Candidate Details", headingFont));
            document.add(new Paragraph(" "));

            document.add(new Paragraph(
                    "Candidate Name : " + interview.getUser().getFullName(),
                    normalFont));
            document.add(new Paragraph(
                    "Company : " + interview.getCompany(),
                    normalFont));

            document.add(new Paragraph(
                    "Interview Type : " + interview.getInterviewType(),
                    normalFont));

            document.add(new Paragraph(
                    "Interview Date : " + interview.getCreatedAt(),
                    normalFont));

            document.add(new Paragraph(
                    "Status : " + report.getStatus(),
                    normalFont));

            document.add(new Paragraph(
                    "Total Score : " + report.getTotalScore(),
                    normalFont));

            document.add(new Paragraph(
                    "Percentage : " + report.getPercentage() + "%",
                    normalFont));

            document.add(new Paragraph(" "));
            document.add(new Paragraph(" "));

            // ===========================
            // NEXT SECTIONS
            // ===========================
            // Question Wise Analysis
            document.add(new Paragraph("Question Wise Analysis", headingFont));
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(4);

            table.setWidthPercentage(100);

            table.setWidths(new float[]{1f, 5f, 2f, 2f});

            // Header

            PdfPCell h1 = new PdfPCell(new Phrase("Q.No", boldFont));
            PdfPCell h2 = new PdfPCell(new Phrase("Question", boldFont));
            PdfPCell h3 = new PdfPCell(new Phrase("Score", boldFont));
            PdfPCell h4 = new PdfPCell(new Phrase("Status", boldFont));

            h1.setHorizontalAlignment(Element.ALIGN_CENTER);
            h2.setHorizontalAlignment(Element.ALIGN_CENTER);
            h3.setHorizontalAlignment(Element.ALIGN_CENTER);
            h4.setHorizontalAlignment(Element.ALIGN_CENTER);

            table.addCell(h1);
            table.addCell(h2);
            table.addCell(h3);
            table.addCell(h4);

// Data

            for (InterviewQuestion q : questions) {

                table.addCell(String.valueOf(q.getQuestionNumber()));

                table.addCell(
                        q.getQuestion() == null ? "" : q.getQuestion()
                );

                table.addCell(
                        q.getScore() == null
                                ? "-"
                                : q.getScore() + "/10"
                );

                table.addCell(
                        Boolean.TRUE.equals(q.getSkipped())
                                ? "Skipped"
                                : "Answered"
                );
            }

            document.add(table);

            document.add(new Paragraph(" "));
            document.add(new Paragraph(" "));
            // Overall Feedback

            document.add(new Paragraph("Overall Interview Feedback", headingFont));
            document.add(new Paragraph(" "));

            document.add(new Paragraph(
                    "Overall Rating : " + feedback.getOverallRating(),
                    boldFont));

            document.add(new Paragraph(" "));

            document.add(new Paragraph(
                    "Summary",
                    boldFont));

            document.add(new Paragraph(
                    feedback.getSummary(),
                    normalFont));

            document.add(new Paragraph(" "));

            document.add(new Paragraph(
                    "Strengths",
                    boldFont));

            for (String strength : feedback.getStrengths()) {

                document.add(new Paragraph(
                        "• " + strength,
                        normalFont));
            }

            document.add(new Paragraph(" "));

            document.add(new Paragraph(
                    "Weaknesses",
                    boldFont));

            for (String weakness : feedback.getWeaknesses()) {

                document.add(new Paragraph(
                        "• " + weakness,
                        normalFont));
            }

            document.add(new Paragraph(" "));

            document.add(new Paragraph(
                    "Suggestions",
                    boldFont));

            for (String suggestion : feedback.getSuggestions()) {

                document.add(new Paragraph(
                        "• " + suggestion,
                        normalFont));
            }

            document.add(new Paragraph(" "));
            document.add(new Paragraph(" "));
            // Resume Gap Analysis

            document.add(new Paragraph("Resume Gap Analysis", headingFont));
            document.add(new Paragraph(" "));

            // Matched Skills
            document.add(new Paragraph(
                    "Matched Skills",
                    boldFont));

            for (String skill : gap.getMatchedSkills()) {

                document.add(new Paragraph(
                        "• " + skill,
                        normalFont));
            }

            document.add(new Paragraph(" "));

            // Missing Skills
            document.add(new Paragraph(
                    "Missing Skills",
                    boldFont));

            for (String skill : gap.getMissingSkills()) {

                document.add(new Paragraph(
                        "• " + skill,
                        normalFont));
            }

            document.add(new Paragraph(" "));

            // Strengths
            document.add(new Paragraph(
                    "Resume Strengths",
                    boldFont));

            for (String strength : gap.getStrengths()) {

                document.add(new Paragraph(
                        "• " + strength,
                        normalFont));
            }

            document.add(new Paragraph(" "));

            // Improvement Plan
            document.add(new Paragraph(
                    "Improvement Plan",
                    boldFont));

            for (String plan : gap.getImprovementPlan()) {

                document.add(new Paragraph(
                        "• " + plan,
                        normalFont));
            }

            document.add(new Paragraph(" "));
            document.add(new Paragraph(" "));
            // Learning Roadmap


            document.add(new Paragraph("Personalized 4 Week Learning Roadmap", headingFont));
            document.add(new Paragraph(" "));

// Week 1
            document.add(new Paragraph("Week 1", boldFont));

            for (String item : roadmap.getWeek1()) {
                document.add(new Paragraph("• " + item, normalFont));
            }

            document.add(new Paragraph(" "));

// Week 2
            document.add(new Paragraph("Week 2", boldFont));

            for (String item : roadmap.getWeek2()) {
                document.add(new Paragraph("• " + item, normalFont));
            }

            document.add(new Paragraph(" "));

// Week 3
            document.add(new Paragraph("Week 3", boldFont));

            for (String item : roadmap.getWeek3()) {
                document.add(new Paragraph("• " + item, normalFont));
            }

            document.add(new Paragraph(" "));

// Week 4
            document.add(new Paragraph("Week 4", boldFont));

            for (String item : roadmap.getWeek4()) {
                document.add(new Paragraph("• " + item, normalFont));
            }

            document.add(new Paragraph(" "));
            document.add(new Paragraph(" "));
            // DETAILED QUESTION ANALYSIS


            document.newPage();

            document.add(new Paragraph("Detailed Question Analysis", titleFont));
            document.add(new Paragraph(" "));

            for (InterviewQuestion q : questions) {

                document.add(new Paragraph(
                        "Question " + q.getQuestionNumber(),
                        headingFont));

                document.add(new Paragraph(" "));

                // Question
                document.add(new Paragraph("Question", boldFont));
                document.add(new Paragraph(
                        q.getQuestion() == null ? "-" : q.getQuestion(),
                        normalFont));

                document.add(new Paragraph(" "));

                // Candidate Answer
                document.add(new Paragraph("Candidate Answer", boldFont));
                document.add(new Paragraph(
                        q.getAnswer() == null || q.getAnswer().isBlank()
                                ? "Not Answered"
                                : q.getAnswer(),
                        normalFont));

                document.add(new Paragraph(" "));

                // Score
                document.add(new Paragraph(
                        "Score : "
                                + (q.getScore() == null ? "-" : q.getScore() + "/10"),
                        boldFont));

                document.add(new Paragraph(" "));

                // Feedback
                document.add(new Paragraph("AI Feedback", boldFont));
                document.add(new Paragraph(
                        q.getFeedback() == null ? "-" : q.getFeedback(),
                        normalFont));

                document.add(new Paragraph(" "));

                // Ideal Answer
                document.add(new Paragraph("Ideal Answer", boldFont));
                document.add(new Paragraph(
                        q.getIdealAnswer() == null ? "-" : q.getIdealAnswer(),
                        normalFont));

                document.add(new Paragraph(" "));

                document.add(new Paragraph(
                        "------------------------------------------------------------"));
                document.add(new Paragraph(" "));
            }

            document.close();

            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }
}