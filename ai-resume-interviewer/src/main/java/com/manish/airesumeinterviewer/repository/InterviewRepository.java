package com.manish.airesumeinterviewer.repository;

import com.manish.airesumeinterviewer.entity.Interview;
import com.manish.airesumeinterviewer.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InterviewRepository extends JpaRepository<Interview ,Long> {
    List<Interview> findByUserEmailOrderByCreatedAtDesc(String email);
    long countByUser(User user);

    long countByUserAndStatus(User user, String status);

    List<Interview> findByUser(User user);

}
