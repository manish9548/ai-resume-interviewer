package com.manish.airesumeinterviewer.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String interviewType;

    @Column(length = 5000)
    private String questions;

    @Column(length = 5000)
    private String answers;

    @Column(length = 5000)
    private String feedback;

    private Integer score;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}