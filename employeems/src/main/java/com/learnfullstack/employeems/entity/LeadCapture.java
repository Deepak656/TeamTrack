package com.learnfullstack.employeems.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "lead_capture")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeadCapture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    @Column(nullable = false)
    private String email;
    private String mobile;
    private String companyName;
    private String industry;
    private String teamSize;
    private String city;
    private String currentAttendanceMethod;

    @Column(length = 1000)
    private String additionalNotes;

    private LocalDateTime submittedAt = LocalDateTime.now();
}
