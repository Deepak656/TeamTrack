package com.learnfullstack.employeems.dto;

import com.learnfullstack.employeems.entity.Employee;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TaskUpdateDto {

    @Schema(description = "Completion remarks or comments", example = "Task done, image uploaded")
    private String comment;

    @Schema(description = "Latitude if location capture enabled", example = "28.6139")
    private Double latitude;

    @Schema(description = "Longitude if location capture enabled", example = "77.2090")
    private Double longitude;

    @Schema(description = "Optional textual location", example = "Connaught Place, Delhi")
    private String locationText;

    @Schema(description = "Image URL if selfie was required", example = "https://myapp.com/uploads/image123.jpg")
    private String imageUrl;
    @Schema(description = "Mark whether task is approved (for manager)", example = "true")
    private Boolean approved;

    @Schema(description = "Task marked Done timestamp", example = "")
    private LocalDateTime markedDoneAt;

    @Schema(description = "Task marked Done by Employee", example = "")
    private Employee markedDoneBy;
}
