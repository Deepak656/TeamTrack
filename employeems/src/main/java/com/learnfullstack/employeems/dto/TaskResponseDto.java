package com.learnfullstack.employeems.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class TaskResponseDto {
    private UUID id;
    private String description;
    private String status;
    private boolean locationRequired;
    private boolean selfieRequired;
    private LocalDateTime createdAt;
    private LocalDateTime markedDoneAt;

    private String managerComment;
    private String doneLocationText;
    private String doneSelfieUrl;

    private String assigneeEmail;
    private String assigneeName;
}
