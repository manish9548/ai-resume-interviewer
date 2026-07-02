package com.manish.airesumeinterviewer.service;

import com.manish.airesumeinterviewer.dto.RegisterRequest;
import com.manish.airesumeinterviewer.entity.User;
import com.manish.airesumeinterviewer.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService{
    private final UserRepository repository;

    @Override
    public String register (RegisterRequest request){
        if(repository.existsByEmail(request.getEmail())){
            return "Email is already exist";
        }
        User user=User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(request.getPassword())
                .build();
        repository.save(user);
        return "User Registered Successfully";


    }

}
