package com.learnfullstack.employeems.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "assigned_to_id", nullable = false)
    private Employee assignedTo;
    @ManyToOne
    @JoinColumn(name = "created_by_id", nullable = false)
    private Employee createdBy; // creator (employee or employer)

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String status = "SUBMITTED"; // SUBMITTED, DONE, APPROVED, REJECTED

    @Column(nullable = false)
    private boolean locationRequired = false;

    @Column(nullable = false)
    private boolean selfieRequired = false;

    private String managerComment;

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime markedDoneAt;

    @ManyToOne
    @JoinColumn(name = "markedDone_by_id")
    private Employee markedDoneBy;

    private Double doneLatitude;
    private Double doneLongitude;
    private String doneLocationText;

    private String doneSelfieUrl;


}
