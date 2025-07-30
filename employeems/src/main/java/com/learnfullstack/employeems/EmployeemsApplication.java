package com.learnfullstack.employeems;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = "com.learnfullstack.employeems.entity")
@EnableJpaRepositories(basePackages = "com.learnfullstack.employeems.repository")
@ComponentScan("com.learnfullstack.employeems")
public class EmployeemsApplication {
	public static void main(String[] args) {
		SpringApplication.run(EmployeemsApplication.class, args);
	}
}
