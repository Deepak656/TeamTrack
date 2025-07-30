package com.learnfullstack.employeems.controller;

import com.learnfullstack.employeems.entity.Employee;
import com.learnfullstack.employeems.repository.EmployeeRepository;
import com.learnfullstack.employeems.security.JwtTokenUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@RestController
public class OAuthController {
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    // Make sure this matches your frontend URL
    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @GetMapping("/oauth-success")
    public void oauthSuccess(HttpServletRequest request, HttpServletResponse response) throws IOException {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication instanceof OAuth2AuthenticationToken)) {
            response.sendRedirect(frontendUrl + "/login?error=Authentication%20failed");
            return;
        }

        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
        OidcUser oidcUser = (OidcUser) oauthToken.getPrincipal();

        String email = oidcUser.getEmail();
        String name = oidcUser.getFullName();
        Optional<Employee> employeeOpt = employeeRepository.findByEmail(email);

        Employee employee;
        if (employeeOpt.isEmpty()) {
            Employee newEmp = new Employee();
            newEmp.setEmail(email);

            // Handle name splitting more safely
            String[] nameParts = name != null ? name.split(" ") : new String[]{"User"};
            newEmp.setFirstName(nameParts[0]);
            newEmp.setLastName(nameParts.length > 1 ? nameParts[nameParts.length - 1] : "");

            newEmp.setUsername(email);
            newEmp.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
            newEmp.setEmployeeRoles(Set.of("USER")); // Set as USER for demo
            newEmp.setEmployeeInactive(false);
            newEmp.setOauthOnly(true); // Mark as OAuth user
            employee = employeeRepository.save(newEmp);
        } else {
            employee = employeeOpt.get();
        }

        // Generate JWT token for the frontend
        String token = jwtTokenUtil.generateToken(employee.getEmail());

        // Create user info JSON for frontend
        String role = employee.getEmployeeRoles().isEmpty() ? "user" :
                employee.getEmployeeRoles().iterator().next().toLowerCase();

        String userInfo = String.format(
                "{\"id\":%d,\"email\":\"%s\",\"firstName\":\"%s\",\"lastName\":\"%s\",\"role\":\"%s\"}",
                employee.getId(),
                employee.getEmail(),
                employee.getFirstName(),
                employee.getLastName(),
                role
        );

        // Option 1: Redirect to login page with success parameters
        String redirectUrl = String.format("%s/login?oauth_success=true&token=%s&user=%s",
                frontendUrl,
                URLEncoder.encode(token, StandardCharsets.UTF_8),
                URLEncoder.encode(userInfo, StandardCharsets.UTF_8));

        response.sendRedirect(redirectUrl);
    }

    @GetMapping("/")
    public String home() {
        return "🎉 Login successful! Welcome to the dashboard.";
    }
}