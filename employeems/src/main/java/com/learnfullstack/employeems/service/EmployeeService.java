package com.learnfullstack.employeems.service;

import com.learnfullstack.employeems.dto.EmployeeDto;
import com.learnfullstack.employeems.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

public interface EmployeeService {
    EmployeeDto createEmployee(EmployeeDto employeeDto);

    List <Employee> saveAllEmployees(List<Employee> employees);

    Page<Employee> getAllActiveEmployees(Pageable pageable);

    Optional<Employee> getEmployeeById(Long id);

    Employee updateEmployee(Long id, Employee updatedEmployee);

    ResponseEntity<String> softDeleteEmployee(Long id);
    Employee findByEmail(String email);



}
