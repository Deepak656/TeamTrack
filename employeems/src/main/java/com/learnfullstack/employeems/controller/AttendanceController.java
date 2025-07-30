package com.learnfullstack.employeems.controller;

import com.learnfullstack.employeems.dto.AttendanceRecordDto;
import com.learnfullstack.employeems.entity.AttendanceRecord;
import com.learnfullstack.employeems.entity.Employee;
import com.learnfullstack.employeems.service.AttendanceService;
import com.learnfullstack.employeems.service.EmployeeService;
import com.learnfullstack.employeems.service.ImageStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;


import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Tag(name = "Attendance", description = "APIs for check-in, check-out, and attendance history")
@RestController
@RequestMapping("/api")
public class AttendanceController {

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private AttendanceService attendanceService;
    @Autowired
    private ImageStorageService imageStorageService;


    @Operation(summary = "Submit check-in/check-out record")
    @PostMapping("/check-in-out")
    public ResponseEntity<?> recordAttendance(
            @RequestParam("checkType") String checkType,
            @RequestParam("latitude") Double latitude,
            @RequestParam("longitude") Double longitude,
            @RequestParam("locationText") String locationText,
            @RequestParam("selfie") MultipartFile selfie,
            Principal principal
    ) throws IOException {
        // Step 1: Get employee by email from Principal
        Employee employee = employeeService.findByEmail(principal.getName());

        // Step 2: Store image file
        String imageUrl = imageStorageService.storeImage(selfie);

        // Step 3: Create and save record
        AttendanceRecord record = new AttendanceRecord();
        record.setEmployee(employee);
        record.setCheckType(checkType);
        record.setTimestamp(LocalDateTime.now());
        record.setLatitude(latitude);
        record.setLongitude(longitude);
        record.setLocationText(locationText);
        record.setImageUrl(imageUrl);

        attendanceService.save(record);

        return ResponseEntity.ok("Attendance recorded successfully.");
    }

    @Operation(summary = "Get attendance records by employee & date range")
    @GetMapping("/history")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<AttendanceRecordDto>> getAttendanceHistory(
            Principal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AttendanceRecord> recordsPage = attendanceService.getAttendanceByEmployeeWithFilters(principal.getName(), fromDate, toDate, pageable);

        Page<AttendanceRecordDto> responsePage = recordsPage.map(record -> {
            AttendanceRecordDto dto = new AttendanceRecordDto();
            dto.setCheckType(record.getCheckType());
            dto.setTimestamp(record.getTimestamp());
            dto.setLatitude(record.getLatitude());
            dto.setLongitude(record.getLongitude());
            dto.setLocationText(record.getLocationText());
            dto.setImageUrl(record.getImageUrl());
            return dto;
        });

        return ResponseEntity.ok(responsePage);
    }



}
