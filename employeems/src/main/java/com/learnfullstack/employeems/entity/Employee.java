package com.learnfullstack.employeems.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name ="employees")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "first_name")
    private String firstName;
    @Column(name = "last_name")
    private String lastName;
    @Column(name = "email_id", nullable = false, unique = true)
    private String email;
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "employee_roles",
            joinColumns = @JoinColumn(name = "employee_id")
    )
    @Column(name = "role_name")
    private Set<String> employeeRoles;

    @Column(name = "employee_inactive")
    private boolean employeeInactive = false;

    @Column(unique = true, nullable = false)
    private String username; // for login

    @Column(nullable = false)
    private String password; // hashed password (BCrypt)
    @Column(name = "oauth_only", nullable = false)
    private boolean oauthOnly = false;

    public boolean isOauthOnly() {
        return oauthOnly;
    }

    public void setOauthOnly(boolean oauthOnly) {
        this.oauthOnly = oauthOnly;
    }
}
