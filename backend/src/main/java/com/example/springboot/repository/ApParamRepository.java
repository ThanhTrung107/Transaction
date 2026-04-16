package com.example.springboot.repository;

import com.example.springboot.entity.ApParam;
import com.example.springboot.entity.ApParamId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApParamRepository extends JpaRepository<ApParam, ApParamId> {
  List<ApParam> findById_ParType(String parType);
}
