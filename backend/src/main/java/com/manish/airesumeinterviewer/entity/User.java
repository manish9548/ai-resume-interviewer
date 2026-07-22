package com.manish.airesumeinterviewer.entity;


import jakarta.persistence.*;
import lombok.*;
import java.util.List;

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
    @OneToMany(mappedBy = "user")
    private List<Resume> resumes;
    @OneToMany(mappedBy = "user")
    private List<Interview> interviews;
}

