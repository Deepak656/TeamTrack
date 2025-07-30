package com.learnfullstack.employeems.security;

import com.learnfullstack.employeems.entity.Employee;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@AllArgsConstructor
public class UserPrincipal implements UserDetails {

    private final Employee employee;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<String> roles = employee.getEmployeeRoles();
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                .collect(Collectors.toSet());
    }

    @Override
    public String getPassword() {
        return employee.getPassword();
    }

    @Override
    public String getUsername() {
        return employee.getEmail();
    }
    public Long getEmployeeId() {
        return employee.getId();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // change if needed
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // change if needed
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // change if needed
    }

    @Override
    public boolean isEnabled() {
        return !employee.isEmployeeInactive(); // false = disabled
    }
}
