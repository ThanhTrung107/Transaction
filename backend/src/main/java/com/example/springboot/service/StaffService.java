package com.example.springboot.service;

import com.example.springboot.constant.Constants;
import com.example.springboot.dto.ApParamRequest;
import com.example.springboot.dto.StaffCreation;
import com.example.springboot.entity.ApParam;
import com.example.springboot.entity.Department;
import com.example.springboot.entity.Staff;
import com.example.springboot.exception.AppException;
import com.example.springboot.exception.AppHttpStatus;
import com.example.springboot.repository.ApParamRepository;
import com.example.springboot.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Service
public class StaffService {
  @Autowired
  private StaffRepository staffRepo;
  @Autowired
  private ApParamRepository apParamRepo;
  @Autowired
  private DepartmentService departmentService;

  public List<ApParamRequest> getAllPositions() {
    return apParamRepo.findById_ParType("STAFF_TYPE").stream().map(ap -> ApParamRequest.builder().parValue(ap.getId().getParValue()).parName(ap.getParName()).build()).collect(Collectors.toList());
  }

  public List<StaffCreation> getByDepartment(long depId) {
    List<Staff> allStaff = staffRepo.findByDepIdAndStatus(depId, Constants.ACTIVE_STATUS);

    Map<String, String> staffTypeLookup = apParamRepo.findById_ParType("STAFF_TYPE").stream().collect(Collectors.toMap(ap -> ap.getId().getParValue(), ApParam::getParName, (existing, replacement) -> existing));

    return allStaff.stream().map(staff -> StaffCreation.builder().id(staff.getId()).staffCode(staff.getStaffCode()).staffName(staff.getStaffName()).staffType(staff.getStaffType()).staffTypeName(staffTypeLookup.getOrDefault(staff.getStaffType(), staff.getStaffType())).depId(staff.getDepId()).email(staff.getEmail()).address(staff.getAddress()).phoneNumber(staff.getPhoneNumber()).birthDay(staff.getBirthDay()).build()).collect(Collectors.toList());
  }

  public Staff getStaffByID(long id) {
    return staffRepo.findById(id).orElseThrow(() -> new AppException(AppHttpStatus.NOT_FOUND));
  }

  public Staff saveStaff(StaffCreation request) {
    Long id = request.getId() != null && request.getId() > 0 ? request.getId() : -1L;
    boolean isUpdate = id != -1L;

    if (staffRepo.existsByStaffCodeAndIdNot(request.getStaffCode(), id)) {
      throw new AppException(AppHttpStatus.BAD_REQUEST, "Mã nhân viên '" + request.getStaffCode() + "' đã " + (isUpdate ? "được sử dụng bởi nhân viên khác" : "tồn tại"));
    }
    if (staffRepo.existsByEmailAndIdNot(request.getEmail(), id)) {
      throw new AppException(AppHttpStatus.BAD_REQUEST, "Email '" + request.getEmail() + "' đã " + (isUpdate ? "được sử dụng bởi nhân viên khác" : "tồn tại"));
    }
    if (staffRepo.existsByPhoneNumberAndIdNot(request.getPhoneNumber(), id)) {
      throw new AppException(AppHttpStatus.BAD_REQUEST, "Số điện thoại '" + request.getPhoneNumber() + "' đã " + (isUpdate ? "được sử dụng bởi nhân viên khác" : "tồn tại"));
    }
    if (staffRepo.existsByIdNumberAndIdNot(request.getIdNumber(), id)) {
      throw new AppException(AppHttpStatus.BAD_REQUEST, "Số CCCD '" + request.getIdNumber() + "' đã " + (isUpdate ? "được sử dụng bởi nhân viên khác" : "tồn tại"));
    }

    Staff staff;
    if (isUpdate) {
      staff = staffRepo.findById(id).orElseThrow(() -> new AppException(AppHttpStatus.NOT_FOUND));
    } else {
      Department department = departmentService.getDepartmentbyID(request.getDepId());
      staff = Staff.builder().department(department).depId(department.getId()).build();
    }

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
    return StaffCreation.builder().id(staff.getId()).staffCode(staff.getStaffCode()).staffName(staff.getStaffName()).staffType(staff.getStaffType()).depId(staff.getDepId()).email(staff.getEmail()).idNumber(staff.getIdNumber()).phoneNumber(staff.getPhoneNumber()).address(staff.getAddress()).desciption(staff.getDescription()).status(staff.getStatus()).birthDay(staff.getBirthDay()).build();
  }
}
