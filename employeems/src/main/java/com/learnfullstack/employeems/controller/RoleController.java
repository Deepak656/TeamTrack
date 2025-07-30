package com.learnfullstack.employeems.controller;

import com.learnfullstack.employeems.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class RoleController {

    private static final Logger logger = LoggerFactory.getLogger(RoleController.class);

    private final EmployeeRepository employeeRepository;

    @GetMapping("/list")
    public ResponseEntity<List<String>> getAvailableRoles() {
        List<String> roles = employeeRepository.findAllDistinctRoles();

        logger.info("Fetched roles: {}", roles);  // <-- ✅ Log the roles

        return ResponseEntity.ok(roles);
    }
}
