package com.learnfullstack.employeems.service.impl;

import com.learnfullstack.employeems.dto.LeadCaptureDto;
import com.learnfullstack.employeems.entity.LeadCapture;
import com.learnfullstack.employeems.repository.LeadCaptureRepository;
import com.learnfullstack.employeems.service.LeadCaptureService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LeadCaptureServiceImpl implements LeadCaptureService {

    private final LeadCaptureRepository leadRepo;

    @Override
    public void saveLead(LeadCaptureDto dto) {
        LeadCapture lead = new LeadCapture();
        lead.setName(dto.getName());
        lead.setEmail(dto.getEmail());
        lead.setMobile(dto.getMobile());
        lead.setCompanyName(dto.getCompanyName());
        lead.setIndustry(dto.getIndustry());
        lead.setTeamSize(dto.getTeamSize());
        lead.setCity(dto.getCity());
        lead.setCurrentAttendanceMethod(dto.getCurrentAttendanceMethod());
        lead.setAdditionalNotes(dto.getAdditionalNotes());

        leadRepo.save(lead);
    }

    @Override
    public List<LeadCapture> getAllLeads() {
        return leadRepo.findAll();
    }
}
