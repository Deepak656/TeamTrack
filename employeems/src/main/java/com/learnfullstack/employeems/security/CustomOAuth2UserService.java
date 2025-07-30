package com.learnfullstack.employeems.security;

import com.learnfullstack.employeems.entity.Employee;
import com.learnfullstack.employeems.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest request) throws OAuth2AuthenticationException {
        OAuth2User user = new DefaultOAuth2UserService().loadUser(request);
        String email = user.getAttribute("email");

        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new OAuth2AuthenticationException("User not registered"));

        if (employee.isEmployeeInactive()) {
            throw new OAuth2AuthenticationException("Account is inactive. Contact admin.");
        }

        return new DefaultOAuth2User(user.getAuthorities(), user.getAttributes(), "email");
    }
}
