package com.learnfullstack.employeems.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AttendanceRecordDto {
    private String checkType;
    private LocalDateTime timestamp;
    private Double latitude;
    private Double longitude;
    private String locationText;
    private String imageUrl;

    // Constructor or builder, getters/setters
}
