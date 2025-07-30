package com.learnfullstack.employeems.repository;

import com.learnfullstack.employeems.entity.Employee;
import com.learnfullstack.employeems.entity.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {
    @Query("SELECT t FROM Task t WHERE "
            + "(:status IS NULL OR t.status = :status) AND "
            + "(:assigneeId IS NULL OR t.assignedTo.id = :assigneeId)")
    Page<Task> findFilteredTasksById(
            @Param("status") String status,
            @Param("assigneeId") String assigneeId,
            Pageable pageable
    );
    @Query("""
    SELECT t FROM Task t 
    WHERE t.assignedTo.id = :employeeId
    AND (:status IS NULL OR t.status = :status)
    AND (:fromDate IS NULL OR t.createdAt >= :fromDate)
    AND (:toDate IS NULL OR t.createdAt <= :toDate)
""")
    Page<Task> findByFilters(
            @Param("employeeId") Long employeeId,
            @Param("status") String status,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate,
            Pageable pageable
    );

    Optional<Task> findById(UUID taskId);
    @Query("SELECT t FROM Task t WHERE t.assignedTo.id = :employeeId")
    List<Task> findByAssignedToId(@Param("employeeId") Long employeeId);}
