package com.learnfullstack.employeems.controller;

import com.learnfullstack.employeems.dto.LeadCaptureDto;
import com.learnfullstack.employeems.entity.LeadCapture;
import com.learnfullstack.employeems.repository.LeadCaptureRepository;
import com.learnfullstack.employeems.service.LeadCaptureService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Lead Capture", description = "Capture leads from landing page")
@RestController
@RequestMapping("/api/leads")
@RequiredArgsConstructor
public class LeadCaptureController {

    @Autowired
    private LeadCaptureRepository leadCaptureRepository;
    @Autowired
    private LeadCaptureService leadCaptureService;

    @Operation(
            summary = "Submit a lead",
            description = "Used by potential customers to express interest in the app"
    )
    @PostMapping("/register")
    public ResponseEntity<String> submitLead(@Valid @RequestBody LeadCaptureDto dto) {
        leadCaptureService.saveLead(dto);
        return ResponseEntity.ok("Thank you for your interest! We'll get in touch soon.");
    }

    @Operation(
            summary = "Get all leads (Admin only)",
            description = "Fetch list of all captured leads. Restricted to admins."
    )
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')") // Optional
    public List<LeadCapture> getAllLeads() {
        return leadCaptureRepository.findAll(Sort.by(Sort.Direction.DESC, "submittedAt"));
    }
}
