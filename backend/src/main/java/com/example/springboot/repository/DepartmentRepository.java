package com.example.springboot.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.springboot.entity.Department;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
  List<Department> findByStatus(String status);

  Optional<Department> findByCode(String code);
}
