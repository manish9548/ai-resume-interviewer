package com.manish.airesumeinterviewer.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
   private String fullName;



    @Column(unique = true,nullable = false)
   private String email;

    @Column(nullable = false)
    private String password;
}
