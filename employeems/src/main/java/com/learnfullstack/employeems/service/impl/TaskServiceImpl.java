package com.learnfullstack.employeems.service.impl;

import com.learnfullstack.employeems.dto.TaskUpdateDto;
import com.learnfullstack.employeems.entity.Employee;
import com.learnfullstack.employeems.entity.Task;
import com.learnfullstack.employeems.repository.EmployeeRepository;
import com.learnfullstack.employeems.repository.TaskRepository;
import com.learnfullstack.employeems.security.UserPrincipal;
import com.learnfullstack.employeems.service.ImageStorageService;
import com.learnfullstack.employeems.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;
import java.security.Principal;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.AccessDeniedException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class TaskServiceImpl implements TaskService {
    @Autowired
    private EmployeeRepository employeeRepository;
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private ImageStorageService imageStorageService;

    @Override
    public Task createTask(String description, Long assigneeId, Long creatorId, boolean locationRequired, boolean selfieRequired) {
        Employee assignee = employeeRepository.findById(assigneeId)
                .orElseThrow(() -> new RuntimeException("Assignee not found"));

        Employee creator = employeeRepository.findById(creatorId)
                .orElseThrow(() -> new RuntimeException("Creator not found"));

        Task task = new Task();
        task.setDescription(description);
        task.setAssignedTo(assignee);
        task.setCreatedBy(creator);
        task.setLocationRequired(locationRequired);
        task.setSelfieRequired(selfieRequired);
        return taskRepository.save(task);
    }
    @Override
    public Task markTaskDone(UUID taskId, String actorEmail, Double lat, Double lng, String locationText, MultipartFile selfie) throws IOException {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        // Check role-based access for completion
        Employee actor = employeeRepository.findByEmail(actorEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!actor.getId().equals(task.getAssignedTo().getId()) && !actor.getEmployeeRoles().contains("ADMIN") && !actor.getEmployeeRoles().contains("MANAGER")) {
            throw new AccessDeniedException("Only employee or admin/manager can mark this task done");
        }

        if (task.isLocationRequired()) {
            task.setDoneLatitude(lat);
            task.setDoneLongitude(lng);
            task.setDoneLocationText(locationText);
        }

        if (task.isSelfieRequired() && selfie != null && !selfie.isEmpty()) {
            String imageUrl = imageStorageService.storeImage(selfie);
            task.setDoneSelfieUrl(imageUrl);
        }

        task.setStatus("DONE");
        task.setMarkedDoneAt(LocalDateTime.now());

        return taskRepository.save(task);
    }

    @Override
    public Page<Task> findByStatusAndAssignedTo(String status, String assigneeId, Pageable pageable) {
        return taskRepository.findFilteredTasksById(status, assigneeId, pageable);
    }

    @Override
    public void reviewTask(UUID taskId, TaskUpdateDto dto, String reviewerEmail) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with ID: " + taskId));

        Employee reviewer = employeeRepository.findByEmail(reviewerEmail)
                .orElseThrow(() -> new RuntimeException("Reviewer not found"));

        task.setManagerComment(dto.getComment());
        task.setMarkedDoneBy(reviewer); // ✅ use authenticated user
        task.setMarkedDoneAt(LocalDateTime.now());
        task.setStatus(dto.getApproved() != null && dto.getApproved() ? "APPROVED" : "REJECTED");

        taskRepository.save(task);
    }

    @Override
    public List<Task> getTasksByEmail(String email) {
        // Check role-based access for completion
        Employee actor = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return taskRepository.findByAssignedToId(actor.getId());
    }

    @Override
    public Task getTaskById(UUID id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with ID: " + id));
    }

    @Override
    public void writeTasksAsCsv(PrintWriter writer) {
        writer.println("Task ID,Description,Status,Assignee Email,Created By,Location Required,Selfie Required,Marked Done At");

        List<Task> allTasks = taskRepository.findAll(); // or filtered
        for (Task task : allTasks) {
            writer.printf(
                    "%s,%s,%s,%s,%s,%s,%s,%s\n",
                    task.getId(),
                    task.getDescription(),
                    task.getStatus(),
                    task.getAssignedTo().getEmail(),
                    task.getCreatedBy().getEmail(),
                    task.isLocationRequired(),
                    task.isSelfieRequired(),
                    task.getMarkedDoneAt() != null ? task.getMarkedDoneAt().toString() : ""
            );
        }
    }

    @Override
    public void updateTaskStatus(UUID taskId, TaskUpdateDto dto, Principal principal) {
        // Extract the authenticated manager from the Principal
        UserPrincipal userPrincipal = (UserPrincipal) ((Authentication) principal).getPrincipal();
        Employee manager = userPrincipal.getEmployee();

        // Fetch the task to update
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        // Update task status if approval decision is provided
        if (dto.getApproved() != null) {
            task.setStatus(dto.getApproved() ? "APPROVED" : "REJECTED");
        }

        // Optional comment from manager
        if (dto.getComment() != null) {
            task.setManagerComment(dto.getComment());
        }

        // Log who approved/rejected and when
        task.setMarkedDoneBy(manager);
        task.setMarkedDoneAt(LocalDateTime.now());

        taskRepository.save(task);
    }




    @Override
    public List<Task> getTasksByEmployee(Long employeeId) {
        return taskRepository.findByAssignedToId(employeeId);
    }

    @Override
    public Page<Task> getAssignedTasksWithFilters(String email, String status, LocalDate fromDate, LocalDate toDate, Pageable pageable) {
        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return taskRepository.findByFilters(employee.getId(), status, fromDate, toDate, pageable);
    }




}
