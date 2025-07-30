package com.learnfullstack.employeems.service;

import com.learnfullstack.employeems.entity.AttendanceRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public interface AttendanceService {
    void save(AttendanceRecord record);
    List<AttendanceRecord> getAttendanceByEmployee(String email);
    Page<AttendanceRecord> getAttendanceByEmployeeWithFilters(String email, LocalDate from, LocalDate to, Pageable pageable);


}
