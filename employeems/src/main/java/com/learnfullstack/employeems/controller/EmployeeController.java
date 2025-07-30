package com.learnfullstack.employeems.controller;

import com.learnfullstack.employeems.dto.EmployeeDto;
import com.learnfullstack.employeems.dto.EmployeeDropdownDTO;
import com.learnfullstack.employeems.entity.Employee;
import com.learnfullstack.employeems.repository.EmployeeRepository;
import com.learnfullstack.employeems.security.UserPrincipal;
import com.learnfullstack.employeems.service.EmployeeService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@RestController
@RequestMapping("/api/employees")
@PreAuthorize("hasRole('ADMIN')")
public class EmployeeController {
    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private EmployeeRepository employeeRepository;

    @PostMapping
    public ResponseEntity<EmployeeDto> createEmployee(@RequestBody EmployeeDto employeeDto){
        EmployeeDto savedEmployee = employeeService.createEmployee(employeeDto);
        return new ResponseEntity<>(savedEmployee, HttpStatus.CREATED);
    }
    @PostMapping("/bulk")
    public ResponseEntity<List<Employee>> saveAllEmployees(@RequestBody List<Employee> givenemployees){
        List<Employee> savedEmployees = employeeService.saveAllEmployees(givenemployees);
        return ResponseEntity.ok(savedEmployees);
    }

    @GetMapping("/active-dropdown")
    public List<EmployeeDropdownDTO> getActiveEmployees() {
        return employeeRepository.findAllByEmployeeInactiveFalse()
                .stream()
                .map(emp -> new EmployeeDropdownDTO(
                        emp.getFirstName(),
                        emp.getLastName(),
                        emp.getEmail()
                ))
                .toList();
    }

    @GetMapping("/me")
    public ResponseEntity<String> currentUser(Authentication authentication) {
        UserPrincipal user = (UserPrincipal) authentication.getPrincipal();
        return ResponseEntity.ok("Hello " + user.getEmployee().getFirstName());
    }


    @GetMapping
    public ResponseEntity<Page<Employee>> getAllActiveEmployee(@RequestParam(defaultValue = "0") int page,
                                                               @RequestParam(defaultValue = "10") int size){
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(employeeService.getAllActiveEmployees(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id){
        return employeeService.getEmployeeById(id)
                .map(employee -> ResponseEntity.ok(employee))           // 200 OK
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable Long id, @RequestBody Employee employeeRequest){
        try{
        Employee updated = employeeService.updateEmployee(id, employeeRequest);
        return ResponseEntity.ok(updated);}
        catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/softdelete")
    public ResponseEntity<String> softDeleteEmployee(@PathVariable Long id){
        return employeeService.softDeleteEmployee(id);
    }

    @GetMapping("/data")
    public String getData(){
        return "Welcome to spring security";
    }

    @GetMapping("/by-email/{email}")
    public ResponseEntity<EmployeeDto> getByEmail(@PathVariable String email) {
        Optional<Employee> employee = employeeRepository.findByEmail(email);
        if (employee.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        Employee emp = employee.get();

        // Manual mapping or use a mapper if you have one
        EmployeeDto dto = new EmployeeDto();
        dto.setId(emp.getId());
        dto.setFirstName(emp.getFirstName());
        dto.setLastName(emp.getLastName());
        dto.setEmail(emp.getEmail());
        dto.setUsername(emp.getUsername());
        dto.setEmployeeInactive(emp.isEmployeeInactive());
        dto.setEmployeeRoles(emp.getEmployeeRoles());

        return ResponseEntity.ok(dto);
    }


}
