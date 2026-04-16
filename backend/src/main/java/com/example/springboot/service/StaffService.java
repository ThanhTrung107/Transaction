package com.example.springboot.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.springboot.dto.StaffCreation;
import com.example.springboot.entity.ApParam;
import com.example.springboot.entity.Department;
import com.example.springboot.entity.Staff;
import com.example.springboot.repository.ApParamRepository;
import com.example.springboot.repository.StaffRepository;


@Service
public class StaffService {
  @Autowired
  private StaffRepository staffRepo;

  @Autowired
  private ApParamRepository apParamRepo;
  @Autowired
  private DepartmentService departmentService;

  public List<StaffCreation> getByDepartment(long depId){
    List<Staff> allStaff = staffRepo.findByDepIdAndStatus(depId, "1");

    Map<String, String> staffTypeLookup = apParamRepo.findById_ParType("STAFF_TYPE")
      .stream()
      .collect(Collectors.toMap(
        ap -> ap.getId().getParValue(),
        ApParam::getParName,
        (existing, replacement) -> existing
      ));

    return allStaff.stream()
      .map(staff -> StaffCreation.builder()
        .id(staff.getId())
        .staffCode(staff.getStaffCode())
        .staffName(staff.getStaffName())
        .staffType(staff.getStaffType())
        .staffTypeName(staffTypeLookup.getOrDefault(staff.getStaffType(), staff.getStaffType()))
        .depId(staff.getDepId())
        .email(staff.getEmail())
        .address(staff.getAddress())
        .phoneNumber(staff.getPhoneNumber())
        .birthDay(staff.getBirthDay())
        .build())
      .collect(Collectors.toList());
  }

  public Staff getStaffByID(long id){
    return staffRepo.findById(id)
      .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên với ID: " + id));
  }

  public Staff createStaff(long departmentID, StaffCreation request) {
    Department department = departmentService.getDepartmentbyID(departmentID);

    Staff staff = Staff.builder()
      .department(department)
      .depId(department.getId())  // Set depId explicitly
      .staffName(request.getStaffName())
      .staffCode(request.getStaffCode())
      .staffType(request.getStaffType())
      .email(request.getEmail())
      .phoneNumber(request.getPhoneNumber())
      .address(request.getAddress())
      .description(request.getDesciption())
      .idNumber(request.getIdNumber())
      .status(request.getStatus())
      .birthDay(request.getBirthDay())
      .build();

    return staffRepo.save(staff);
  }

  public Staff updateStaff(long staffId, StaffCreation request){
    Staff staff = staffRepo.findById(staffId)
      .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên với ID: " + staffId));

    staff.setStaffName(request.getStaffName());
    staff.setStaffCode(request.getStaffCode());
    staff.setStaffType(request.getStaffType());
    staff.setEmail(request.getEmail());
    staff.setPhoneNumber(request.getPhoneNumber());
    staff.setAddress(request.getAddress());
    staff.setDescription(request.getDesciption());
    staff.setIdNumber(request.getIdNumber());
    staff.setStatus(request.getStatus());
    staff.setBirthDay(request.getBirthDay());

    return staffRepo.save(staff);
  }

  public void deleteStaff(long staffId) {
    staffRepo.deleteById(staffId);
  }

  // Helper method to convert Staff entity to DTO (tránh circular reference)
  public StaffCreation convertToDTO(Staff staff) {
    return StaffCreation.builder()
      .id(staff.getId())
      .staffCode(staff.getStaffCode())
      .staffName(staff.getStaffName())
      .staffType(staff.getStaffType())
      .depId(staff.getDepId())
      .email(staff.getEmail())
      .idNumber(staff.getIdNumber())
      .phoneNumber(staff.getPhoneNumber())
      .address(staff.getAddress())
      .desciption(staff.getDescription())
      .status(staff.getStatus())
      .birthDay(staff.getBirthDay())
      .build();
  }
}
