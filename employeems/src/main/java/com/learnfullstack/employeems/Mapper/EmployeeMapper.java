package com.learnfullstack.employeems.Mapper;

import com.learnfullstack.employeems.dto.EmployeeDto;
import com.learnfullstack.employeems.entity.Employee;

public class EmployeeMapper {
    public static EmployeeDto mapToEmployeeDto(Employee employee){
        return new EmployeeDto(
                employee.getId(),
                employee.getFirstName(),
                employee.getLastName(),
                employee.getEmail(),
                employee.getEmployeeRoles(),
                employee.isEmployeeInactive(),
                employee.getUsername(), // assuming present in DTO
                employee.getPassword()
        );
    }
    public static Employee mapToEmployee(EmployeeDto dto) {
        Employee emp = new Employee();
        emp.setId(dto.getId());
        emp.setFirstName(dto.getFirstName());
        emp.setLastName(dto.getLastName());
        emp.setEmail(dto.getEmail());
        emp.setEmployeeRoles(dto.getEmployeeRoles());
        emp.setEmployeeInactive(dto.isEmployeeInactive());
        emp.setUsername(dto.getUsername());
        emp.setPassword(dto.getPassword());
        return emp;
    }
}
