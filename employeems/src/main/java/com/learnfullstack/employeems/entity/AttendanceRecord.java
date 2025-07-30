package com.learnfullstack.employeems.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.web.service.annotation.GetExchange;

import java.time.LocalDateTime;
import java.util.UUID;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "attendance_record")
public class AttendanceRecord {

    @Id
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "check_type", nullable = false)
    private String checkType; // IN or OUT

    @Column(nullable = false)
    private LocalDateTime timestamp;

    private Double latitude;
    private Double longitude;

    private String locationText;

    private String imageUrl;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
