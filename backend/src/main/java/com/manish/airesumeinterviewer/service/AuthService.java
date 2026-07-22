package com.manish.airesumeinterviewer.service;

import com.manish.airesumeinterviewer.dto.LoginRequest;
import com.manish.airesumeinterviewer.dto.RegisterRequest;
import com.manish.airesumeinterviewer.jwt.JwtService;

public interface AuthService {
    String register(RegisterRequest request);
    String login(LoginRequest request);

}
