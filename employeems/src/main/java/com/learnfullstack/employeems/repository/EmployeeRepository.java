package com.learnfullstack.employeems.repository;

import com.learnfullstack.employeems.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository <Employee, Long> {
    Page<Employee> findByEmployeeInactiveFalse(Pageable pageable);
    Optional<Employee> findByEmail(String email);
    List<Employee> findAllByEmployeeInactiveFalse();

    @Query("SELECT DISTINCT r FROM Employee e JOIN e.employeeRoles r")
    List<String> findAllDistinctRoles();

}
