package com.learnfullstack.employeems.repository;

import com.learnfullstack.employeems.entity.LeadCapture;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeadCaptureRepository extends JpaRepository<LeadCapture, Long> {
}
