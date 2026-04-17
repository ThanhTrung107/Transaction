package com.example.springboot.repository;

import com.example.springboot.entity.Staff;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {

  boolean existsByStaffCode(String staffCode);

  boolean existsByEmail(String email);

  boolean existsByPhoneNumber(String phoneNumber);

  boolean existsByIdNumber(String idNumber);

  boolean existsByStaffCodeAndIdNot(String staffCode, Long id);

  boolean existsByEmailAndIdNot(String email, Long id);

  boolean existsByPhoneNumberAndIdNot(String phoneNumber, Long id);

  boolean existsByIdNumberAndIdNot(String idNumber, Long id);

  List<Staff> findByDepIdAndStatus(long depId, String status);

  @Modifying
  @Transactional
  @Query("DELETE FROM Staff d WHERE d.depId = :departmentId")
  void deleteByDepartmentId(@Param("departmentId") long deparmentId);
}
