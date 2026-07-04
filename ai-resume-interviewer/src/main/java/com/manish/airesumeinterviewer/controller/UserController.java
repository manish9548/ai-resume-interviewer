package com.manish.airesumeinterviewer.controller;


import com.manish.airesumeinterviewer.entity.User;
import com.manish.airesumeinterviewer.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {
    private final UserRepository repository;
    @GetMapping("/me")
    public User me(Authentication authentication) {

        return repository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User Not Found"));

    }

}
