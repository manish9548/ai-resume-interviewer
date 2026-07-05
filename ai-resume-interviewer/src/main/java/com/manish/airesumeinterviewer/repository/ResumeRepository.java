package com.manish.airesumeinterviewer.repository;

import com.manish.airesumeinterviewer.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResumeRepository extends JpaRepository<Resume,Long> {


}
