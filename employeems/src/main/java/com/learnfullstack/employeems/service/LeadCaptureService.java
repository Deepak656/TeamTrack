package com.learnfullstack.employeems.service;

import com.learnfullstack.employeems.dto.LeadCaptureDto;
import com.learnfullstack.employeems.entity.LeadCapture;

import java.util.List;

public interface LeadCaptureService {
    void saveLead(LeadCaptureDto dto);

    List<LeadCapture> getAllLeads();
}
