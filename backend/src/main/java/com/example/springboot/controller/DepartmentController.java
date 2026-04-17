package com.example.springboot.controller;

import com.example.springboot.dto.DepartmentTree;
import com.example.springboot.dto.StaffCreation;
import com.example.springboot.entity.Department;
import com.example.springboot.service.DepartmentService;
import com.example.springboot.service.StaffService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/departments")
public class DepartmentController {
  @Autowired
  private DepartmentService departmentService;
  @Autowired
  private StaffService staffService;

  // Trả về toàn bộ cây phòng ban
  @GetMapping("/tree")
  public ResponseEntity<List<DepartmentTree>> getTree() {
    return ResponseEntity.ok(departmentService.getTree());
  }

  // Khi click vào 1 phòng ban → trả về danh sách nhân viên
  @GetMapping("/{depId}/staffs")
  public ResponseEntity<List<StaffCreation>> getStaffs(@PathVariable Long depId) {
    return ResponseEntity.ok(staffService.getByDepartment(depId));
  }

  // Lấy thông tin chi tiết 1 phòng ban (cho chức năng sửa)
  @GetMapping("/{id}/info")
  public ResponseEntity<Department> getDepartmentById(@PathVariable Long id) {
    Department department = departmentService.getDepartmentbyID(id);
    return ResponseEntity.ok(department);
  }

  @PostMapping
  public DepartmentTree createDepartment(@RequestBody @Valid DepartmentTree request) {
    Department saved = departmentService.createDepartment(request);
    // Convert to DepartmentTree without children to avoid circular reference
    return new DepartmentTree(saved.getId(), saved.getCode(), saved.getName(), saved.getParentId());
  }

  @PutMapping("/{id}")
  public DepartmentTree updateDepartment(@PathVariable long id, @RequestBody @Valid DepartmentTree request) {
    Department saved = departmentService.updateDepartment(id, request);
    // Convert to DepartmentTree without children to avoid circular reference
    return new DepartmentTree(saved.getId(), saved.getCode(), saved.getName(), saved.getParentId());
  }

  @DeleteMapping("/{id}")
  public void deleteDepartment(@PathVariable long id) {
    departmentService.deleteDepartment(id);
  }
}
