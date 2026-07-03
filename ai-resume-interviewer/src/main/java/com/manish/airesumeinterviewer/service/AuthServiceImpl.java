package com.manish.airesumeinterviewer.service;

import com.manish.airesumeinterviewer.dto.LoginRequest;
import com.manish.airesumeinterviewer.dto.RegisterRequest;
import com.manish.airesumeinterviewer.entity.User;
import com.manish.airesumeinterviewer.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService{
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public String register (RegisterRequest request){
        if(repository.existsByEmail(request.getEmail())){
            return "Email is already exist";
        }
        User user=User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();
        repository.save(user);
        return "User Registered Successfully";


    }
    @Override
    public String login(LoginRequest request){
        User user = repository.findByEmail(request.getEmail())
                .orElseThrow(()-> new RuntimeException("User Not Found"));
        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())){
            throw new RuntimeException("Invalid Password");
        }
        return "Login Successfully";
    }

}
