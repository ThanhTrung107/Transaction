package com.example.springboot.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.springboot.dto.StaffCreation;
import com.example.springboot.entity.Staff;
import com.example.springboot.service.StaffService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/staff")
public class StaffController {
  private final StaffService staffService;

  public StaffController(StaffService staffService) {
    this.staffService = staffService;
  }

  // Lấy thông tin chi tiết 1 nhân viên 
  @GetMapping("/{id}/info")
  public ResponseEntity<StaffCreation> getStaffInfo(@PathVariable long id) {
    Staff staff = staffService.getStaffByID(id);
    return ResponseEntity.ok(staffService.convertToDTO(staff));
  }

  @PostMapping("/{departmentId}")
  public StaffCreation createStaff(@PathVariable long departmentId, @RequestBody @Valid StaffCreation request) {
    Staff staff = staffService.createStaff(departmentId, request);
    return staffService.convertToDTO(staff);
  }

  @PutMapping("/{staffId}")
  public StaffCreation updateStaff(@PathVariable long staffId, @RequestBody @Valid StaffCreation request) {
    Staff staff = staffService.updateStaff(staffId, request);
    return staffService.convertToDTO(staff);
  }

  @DeleteMapping("/{staffId}")
  public void deleteDetail(@PathVariable long staffId) {
    staffService.deleteStaff(staffId);
  }
}
