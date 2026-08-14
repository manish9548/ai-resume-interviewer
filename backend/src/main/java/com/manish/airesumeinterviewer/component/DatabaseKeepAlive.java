package com.manish.airesumeinterviewer.component;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class DatabaseKeepAlive {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Har 10 minute me 'SELECT 1' query chalayega
    @Scheduled(fixedRate = 600000)
    public void pingDatabase() {
        try {
            jdbcTemplate.execute("SELECT 1");
            System.out.println("Keep-alive ping sent to DB.");
        } catch (Exception e) {
            System.out.println("Ping failed: " + e.getMessage());
        }
    }
}