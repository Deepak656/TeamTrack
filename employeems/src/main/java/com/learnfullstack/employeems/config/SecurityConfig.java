package com.learnfullstack.employeems.config;

import com.learnfullstack.employeems.security.CustomAuthenticationFailureHandler;
import com.learnfullstack.employeems.security.CustomOAuth2UserService;
import com.learnfullstack.employeems.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private UserDetailsService userDetailsService;
    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private CustomOAuth2UserService customOAuth2UserService;

    @Autowired
    private CustomAuthenticationFailureHandler customAuthenticationFailureHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
           return http
                .csrf(AbstractHttpConfigurer::disable) //csrf token disbaled
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(request -> request
                        .requestMatchers("/api/auth/**", "/login/**", "/oauth2/**", "/oauth-success", "/api/leads/register").permitAll()
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
               .oauth2Login(oauth -> oauth
                       .userInfoEndpoint(user -> user.userService(customOAuth2UserService)) // ✅ Plug in custom OAuth2 user check
                       .failureHandler((request, response, exception) -> { // ✅ Handle inactive/error in Google login
                           response.setStatus(401);
                           response.setContentType("application/json");
                           response.getWriter().write("{\"error\": \"" + exception.getMessage() + "\"}");
                       })
                       .defaultSuccessUrl("/oauth-success", true)  // 👈 ENSURE this line exists exactly like this
               )
               .sessionManagement(session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)) //statless
               .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
               .build();


    }
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


}
