package com.learnfullstack.employeems.config;

import com.learnfullstack.employeems.entity.Employee;
import com.learnfullstack.employeems.repository.EmployeeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@Configuration
public class AdminUserInitializer {

    @Bean
    public CommandLineRunner createAdminUser(EmployeeRepository employeeRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (employeeRepository.count() == 0) {
                Employee admin = new Employee();
                admin.setFirstName("Deepak");
                admin.setLastName("Kumar");
                admin.setEmail("deepak01962@gmail.com");
                admin.setUsername("deepak");
                admin.setPassword(passwordEncoder.encode("deepak123")); // BCrypt encoded
                admin.setEmployeeRoles(Set.of("ADMIN"));
                admin.setEmployeeInactive(false);

                employeeRepository.save(admin);
                System.out.println("✅ Admin user created: username=deepak, password=deepak123");
            } else {
                System.out.println("ℹ️ Admin already exists or employee table is not empty");
            }
        };
    }
}
