package com.learnfullstack.employeems.controller;

import com.learnfullstack.employeems.dto.TaskResponseDto;
import com.learnfullstack.employeems.dto.TaskUpdateDto;
import com.learnfullstack.employeems.entity.Employee;
import com.learnfullstack.employeems.entity.Task;
import com.learnfullstack.employeems.security.UserPrincipal;
import com.learnfullstack.employeems.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Tag(name = "Task Management", description = "APIs to create, update, mark done, and manage tasks")
@RestController
@RequestMapping("api/task")
public class TaskController {
    @Autowired
    private TaskService taskService;

    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    @Operation(summary = "Create a new task")
    @PostMapping("/create")
    public ResponseEntity<?> createTask(
            @RequestParam String description,
            @RequestParam Long assigneeId,
            @RequestParam(defaultValue = "false") boolean locationRequired,
            @RequestParam(defaultValue = "false") boolean selfieRequired,
            Principal principal
    ) {
        UserPrincipal user = (UserPrincipal) ((Authentication) principal).getPrincipal();
        Long creatorId = user.getEmployeeId();
        Task task = taskService.createTask(description, assigneeId, creatorId, locationRequired, selfieRequired);
        return ResponseEntity.ok(task);
    }

    @Operation(summary = "Mark task as done by employee or manager")
    @PostMapping("/mark-done/{taskId}")
    public ResponseEntity<?> markDone(
            @PathVariable UUID taskId,
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam String locationText,
            @RequestPart(required = false) MultipartFile selfie,
            Principal principal
    ) throws IOException {
        Task updated = taskService.markTaskDone(taskId, principal.getName(), latitude, longitude, locationText, selfie);
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Get tasks assigned to an employee")
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Task>> getTasksByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(taskService.getTasksByEmployee(employeeId));
    }

    @GetMapping("/manager-dashboard")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Page<Task>> getTasksForManager(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String assigneeEmail,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate
    ) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Task> tasks = taskService.findByStatusAndAssignedTo(status, assigneeEmail, pageable);
        return ResponseEntity.ok(tasks);
    }

    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    @Operation(summary = "Approve or comment on a task")
    @PostMapping("/{taskId}/review")
    public ResponseEntity<String> reviewTask(
            @PathVariable UUID taskId,
            @RequestBody TaskUpdateDto dto,
            Principal principal
    ) {
        taskService.reviewTask(taskId, dto, principal.getName());
        return ResponseEntity.ok("Task reviewed");
    }


    @Operation(summary = "View single task by ID")
    @GetMapping("/{taskId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('USER')")
    public ResponseEntity<Task> getSingleTask(@PathVariable UUID taskId) {
        Task task = taskService.getTaskById(taskId);
        return ResponseEntity.ok(task);
    }

    @Operation(summary = "Get tasks for logged-in user")
    @GetMapping("/my-tasks")
    public ResponseEntity<List<Task>> getMyTasks(Principal principal) {
        return ResponseEntity.ok(taskService.getTasksByEmail(principal.getName()));
    }

    @GetMapping("/export")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public void exportTasks(HttpServletResponse response) throws IOException {
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=tasks.csv");
        taskService.writeTasksAsCsv(response.getWriter());
    }

    @PatchMapping("/update-status")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<String> updateStatus(
            @RequestParam UUID taskId,
            @RequestBody TaskUpdateDto dto,
            Principal principal
    ) {
        taskService.updateTaskStatus(taskId, dto, principal);
        return ResponseEntity.ok("Status updated to " + (dto.getApproved() ? "APPROVED" : "REJECTED"));
    }



    @GetMapping("/assigned-to-me")
    public ResponseEntity<Page<TaskResponseDto>> getAssignedTasksToMe(
            Principal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate
    ) {
        Page<Task> tasks = taskService.getAssignedTasksWithFilters(principal.getName(), status, fromDate, toDate, PageRequest.of(page, size));

        Page<TaskResponseDto> dtoPage = tasks.map(task -> {
            TaskResponseDto dto = new TaskResponseDto();
            dto.setId(task.getId());
            dto.setDescription(task.getDescription());
            dto.setStatus(task.getStatus());
            dto.setLocationRequired(task.isLocationRequired());
            dto.setSelfieRequired(task.isSelfieRequired());
            dto.setCreatedAt(task.getCreatedAt());
            dto.setMarkedDoneAt(task.getMarkedDoneAt());
            dto.setManagerComment(task.getManagerComment());
            dto.setDoneLocationText(task.getDoneLocationText());
            dto.setDoneSelfieUrl(task.getDoneSelfieUrl());
            dto.setAssigneeEmail(task.getAssignedTo().getEmail());
            dto.setAssigneeName(task.getAssignedTo().getFirstName() + " " + task.getAssignedTo().getLastName());
            return dto;
        });

        return ResponseEntity.ok(dtoPage);
    }

    @Operation(summary = "View single task by ID")
    @GetMapping("/{id}")
    public ResponseEntity<TaskResponseDto> getTaskById(@PathVariable UUID id) {
        Task task = taskService.getTaskById(id);

        TaskResponseDto dto = new TaskResponseDto();
        dto.setId(task.getId());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus());
        dto.setLocationRequired(task.isLocationRequired());
        dto.setSelfieRequired(task.isSelfieRequired());
        dto.setCreatedAt(task.getCreatedAt());
        dto.setMarkedDoneAt(task.getMarkedDoneAt());
        dto.setManagerComment(task.getManagerComment());
        dto.setDoneLocationText(task.getDoneLocationText());
        dto.setDoneSelfieUrl(task.getDoneSelfieUrl());
        dto.setAssigneeEmail(task.getAssignedTo().getEmail());
        dto.setAssigneeName(task.getAssignedTo().getFirstName() + " " + task.getAssignedTo().getLastName());

        return ResponseEntity.ok(dto);
    }



}
