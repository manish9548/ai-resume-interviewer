package com.manish.airesumeinterviewer.repository;

import com.manish.airesumeinterviewer.entity.InterviewQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InterviewQuestionRepository
        extends JpaRepository<InterviewQuestion, Long> {
    List<InterviewQuestion> findByInterviewIdOrderByQuestionNumber(Long interviewId);
}