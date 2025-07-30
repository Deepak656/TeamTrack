package com.learnfullstack.employeems.service;

import com.learnfullstack.employeems.dto.TaskUpdateDto;
import com.learnfullstack.employeems.entity.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.PrintWriter;
import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface TaskService {
    public Task createTask(
            String description,
            Long assigneeId,
            Long creatorId,
            boolean locationRequired,
            boolean selfieRequired
    );

    Page<Task> findByStatusAndAssignedTo(String status, String assignedTo, Pageable pageable);

    Task markTaskDone(UUID taskId, String actorEmail, Double lat, Double lng, String locationText, MultipartFile selfie) throws IOException;

    void updateTaskStatus(UUID taskId, TaskUpdateDto dto, Principal principal);

    List<Task> getTasksByEmployee(Long employeeId);

    void reviewTask(UUID taskId, TaskUpdateDto dto, String reviewerEmail);

    List<Task> getTasksByEmail(String username);

    Task getTaskById(UUID taskId);

    void writeTasksAsCsv(PrintWriter writer);

    Page<Task> getAssignedTasksWithFilters(String email, String status, LocalDate fromDate, LocalDate toDate, Pageable pageable);


}
