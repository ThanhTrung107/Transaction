package com.example.springboot.controller;

import com.example.springboot.dto.ApParamRequest;
import com.example.springboot.dto.StaffCreation;
import com.example.springboot.entity.Staff;
import com.example.springboot.service.StaffService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

  @GetMapping("/position")
  public ResponseEntity<List<ApParamRequest>> getPositions() {
    return ResponseEntity.ok(staffService.getAllPositions());
  }


  @PostMapping("/save")
  public StaffCreation saveStaff(@RequestBody @Valid StaffCreation request) {
    Staff staff = staffService.saveStaff(request);
    return staffService.convertToDTO(staff);
  }

  @DeleteMapping("/{staffId}")
  public void deleteDetail(@PathVariable long staffId) {
    staffService.deleteStaff(staffId);
  }
}
