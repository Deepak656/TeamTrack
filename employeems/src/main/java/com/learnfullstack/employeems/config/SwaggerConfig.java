package com.learnfullstack.employeems.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        final String BEARER_SCHEME = "bearerAuth";
        final String OAUTH2_SCHEME = "oauth2";

        return new OpenAPI()
                .info(new Info()
                        .title("Employee Selfie Attendance & Task API")
                        .version("1.0")
                        .description("Backend API for attendance, task management, and employee roles"))
                .addSecurityItem(new SecurityRequirement().addList(BEARER_SCHEME))
                .addSecurityItem(new SecurityRequirement().addList(OAUTH2_SCHEME))
                .components(new Components()
                        .addSecuritySchemes(BEARER_SCHEME,
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .name("Authorization")
                        )
                        .addSecuritySchemes(OAUTH2_SCHEME,
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.OAUTH2)
                                        .description("Login with Google")
                                        .flows(new OAuthFlows()
                                                .authorizationCode(new OAuthFlow()
                                                        .authorizationUrl("https://accounts.google.com/o/oauth2/v2/auth")
                                                        .tokenUrl("https://oauth2.googleapis.com/token")
                                                        .scopes(new Scopes()
                                                                .addString("openid", "OpenID")
                                                                .addString("profile", "User Profile")
                                                                .addString("email", "User Email")
                                                        )
                                                )
                                        )
                        )
                );
    }
}
