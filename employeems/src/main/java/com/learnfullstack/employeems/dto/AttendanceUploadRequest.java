package com.learnfullstack.employeems.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AttendanceUploadRequest {
    private String checkType;
    private Double latitude;
    private Double longitude;
    private String locationText;
    private MultipartFile selfie;
}
