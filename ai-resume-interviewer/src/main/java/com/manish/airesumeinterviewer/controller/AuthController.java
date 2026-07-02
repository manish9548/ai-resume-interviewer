package com.manish.airesumeinterviewer.controller;

import com.manish.airesumeinterviewer.dto.RegisterRequest;
import com.manish.airesumeinterviewer.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService service;
    @PostMapping("/register")
    public String register(@Valid @RequestBody RegisterRequest request){
        return service.register(request);

    }

}
