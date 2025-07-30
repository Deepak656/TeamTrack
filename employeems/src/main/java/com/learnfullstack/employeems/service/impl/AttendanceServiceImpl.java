package com.learnfullstack.employeems.service.impl;

import com.learnfullstack.employeems.entity.AttendanceRecord;
import com.learnfullstack.employeems.entity.Employee;
import com.learnfullstack.employeems.repository.AttendanceRepository;
import com.learnfullstack.employeems.repository.EmployeeRepository;
import com.learnfullstack.employeems.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class AttendanceServiceImpl implements AttendanceService {
    @Autowired
    private AttendanceRepository attendanceRepository;
    @Autowired
    private EmployeeRepository employeeRepository;

    @Override
    public void save(AttendanceRecord record) {
        attendanceRepository.save(record);

    }
    @Override
    public List<AttendanceRecord> getAttendanceByEmployee(String email) {
        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Employee not found"));
        return attendanceRepository.findByEmployee(employee);
    }

    @Override
    public Page<AttendanceRecord> getAttendanceByEmployeeWithFilters(String email, LocalDate from, LocalDate to, Pageable pageable) {
        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Employee not found"));

        // Set start and end of date range
        LocalDateTime startDateTime = from != null ? from.atStartOfDay() : LocalDate.MIN.atStartOfDay();
        LocalDateTime endDateTime = to != null ? to.atTime(LocalTime.MAX) : LocalDate.MAX.atTime(LocalTime.MAX);

        return attendanceRepository.findByEmployeeAndTimestampBetweenOrderByTimestampDesc(
                employee,
                startDateTime,
                endDateTime,
                pageable
        );
    }

}
