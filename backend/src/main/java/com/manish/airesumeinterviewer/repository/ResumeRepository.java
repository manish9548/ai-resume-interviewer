package com.manish.airesumeinterviewer.repository;

import com.manish.airesumeinterviewer.entity.Resume;
import com.manish.airesumeinterviewer.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ResumeRepository extends JpaRepository<Resume,Long> {

    Optional<Resume> findTopByUserOrderByUploadedAtDesc(User user);
    List<Resume> findByUserOrderByUploadedAtDesc(User user);
    long countByUser(User user);


}
