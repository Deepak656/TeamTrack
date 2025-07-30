package com.learnfullstack.employeems.controller;

import com.learnfullstack.employeems.entity.Employee;
import com.learnfullstack.employeems.repository.EmployeeRepository;
import com.learnfullstack.employeems.security.JwtTokenUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private EmployeeRepository employeeRepository;
    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @GetMapping("/verify")
    public ResponseEntity<?> verifyToken(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            // You must have your JWT utility here
            if (jwtTokenUtil.validateToken(token)) {
                return ResponseEntity.ok("Token is valid");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token verification failed");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null) {
            email = request.get("username");
        }
        String password = request.get("password");

        logger.info("Login attempt for email: {}", email);

        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );

            logger.info("Login successful for email: {}", email);

            // Get user details
            Optional<Employee> employeeOpt = employeeRepository.findByEmail(email);
            if (employeeOpt.isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("error", "User not found");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            Employee employee = employeeOpt.get();
            String token = jwtTokenUtil.generateToken(email);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("token", token);

            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("id", employee.getId());
            userInfo.put("email", employee.getEmail());
            userInfo.put("firstName", employee.getFirstName());
            userInfo.put("lastName", employee.getLastName());
            userInfo.put("role", employee.getEmployeeRoles().isEmpty() ? "user" :
                    employee.getEmployeeRoles().iterator().next().toLowerCase());

            response.put("user", userInfo);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.warn("Login failed for email: {}", email);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Invalid credentials");
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}
