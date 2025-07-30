package com.learnfullstack.employeems.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@AllArgsConstructor
@Getter
@Setter
public class EmployeeDropdownDTO {
    private String firstName;
    private String lastName;
    private String email;
}
