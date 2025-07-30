package com.learnfullstack.employeems.repository;

import com.learnfullstack.employeems.entity.AttendanceRecord;
import com.learnfullstack.employeems.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface AttendanceRepository extends JpaRepository<AttendanceRecord, UUID> {
    List<AttendanceRecord> findByEmployee(Employee employee);
    Page<AttendanceRecord> findByEmployeeAndTimestampBetweenOrderByTimestampDesc(
            Employee employee,
            LocalDateTime from,
            LocalDateTime to,
            Pageable pageable
    );
}
