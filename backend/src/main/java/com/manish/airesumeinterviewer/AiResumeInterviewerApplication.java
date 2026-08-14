package com.manish.airesumeinterviewer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AiResumeInterviewerApplication {

	public static void main(String[] args) {
		SpringApplication.run(AiResumeInterviewerApplication.class, args);
	}

}
