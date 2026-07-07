package com.manish.airesumeinterviewer.repository;

import com.manish.airesumeinterviewer.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InterviewRepository extends JpaRepository<Interview ,Long> {
}
