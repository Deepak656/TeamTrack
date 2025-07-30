package com.learnfullstack.employeems.service.impl;

import com.learnfullstack.employeems.Mapper.EmployeeMapper;
import com.learnfullstack.employeems.dto.EmployeeDto;
import com.learnfullstack.employeems.entity.Employee;
import com.learnfullstack.employeems.repository.EmployeeRepository;
import com.learnfullstack.employeems.service.EmployeeService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;  // Inject BCrypt encoder
    @Override
    public EmployeeDto createEmployee(EmployeeDto employeeDto) {
        Employee employee = EmployeeMapper.mapToEmployee(employeeDto);
        employee.setPassword(passwordEncoder.encode(employee.getPassword()));
        Employee savedEmployee = employeeRepository.save(employee);
        return EmployeeMapper.mapToEmployeeDto(savedEmployee);
    }

    @Override
    public List <Employee> saveAllEmployees(List<Employee> employees){
        return employeeRepository.saveAll(employees);
    }

    @Override
    public Page<Employee> getAllActiveEmployees(Pageable pageable) {
        return employeeRepository.findByEmployeeInactiveFalse(pageable);
    }

    @Override
    public Optional<Employee> getEmployeeById(Long id) {
        return employeeRepository.findById(id);
    }

    @Override
    public Employee updateEmployee(Long id, Employee updatedEmployee){
        return employeeRepository.findById(id)
                .map(existing -> {
                    existing.setFirstName(updatedEmployee.getFirstName());
                    existing.setLastName(updatedEmployee.getLastName());
                    existing.setEmail(updatedEmployee.getEmail());
                    existing.setEmployeeInactive(updatedEmployee.isEmployeeInactive());
                    existing.setEmployeeRoles(updatedEmployee.getEmployeeRoles()); // ✅ Assign new roles
                    return employeeRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Employee not found with id " + id));
    }

    @Override
    public ResponseEntity<String> softDeleteEmployee(Long id){
        Optional<Employee> optional = employeeRepository.findById(id);
        if (optional.isPresent()){
            Employee employee = optional.get();
            employee.setEmployeeInactive(true); // Mark as soft-deleted
            employeeRepository.save(employee);
            return ResponseEntity.ok("Employee marked as inactive");

        } else {
                return ResponseEntity.notFound().build();
            }
    }

    @Override
    public Employee findByEmail(String email) {
        return employeeRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Employee not found with email: " + email));
    }

}
