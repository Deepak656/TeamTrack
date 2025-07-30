package com.learnfullstack.employeems.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LeadCaptureDto {

    @Schema(description = "Full name of the person", example = "Ravi Sharma")
    @NotBlank(message = "Name is required")
    private String name;

    @Schema(description = "Valid email address", example = "ravi@example.com")
    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Enter a valid 10-digit mobile number")
    private String mobile;

    @Schema(description = "Name of the company", example = "Sharma Distributors")
    private String companyName;

    @Schema(description = "Industry type", example = "Retail")
    private String industry;

    @Schema(description = "Team size (e.g., 1-3, 4-10)", example = "4-10")
    private String teamSize;

    @Schema(description = "City or region", example = "Delhi")
    private String city;

    @Schema(description = "Current method used for attendance", example = "Manual register")
    private String currentAttendanceMethod;

    @Schema(description = "Additional notes or requirements", example = "Need offline support")
    private String additionalNotes;
}
