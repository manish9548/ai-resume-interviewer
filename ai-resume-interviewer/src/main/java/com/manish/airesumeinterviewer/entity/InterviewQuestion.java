package com.manish.airesumeinterviewer.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer questionNumber;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String question;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String answer;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String feedback;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String idealAnswer;

    private Integer score;

    private Boolean skipped;

    @ManyToOne
    @JoinColumn(name = "interview_id")
    private Interview interview;
}