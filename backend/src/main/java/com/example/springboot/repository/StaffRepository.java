package com.example.springboot.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.springboot.entity.Staff;

import jakarta.transaction.Transactional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {

  List<Staff> findByDepIdAndStatus(long depId, String status);

  @Modifying
  @Transactional
  @Query("DELETE FROM Staff d WHERE d.depId = :departmentId")
  void deleteByDepartmentId(@Param("departmentId") long deparmentId);
}
