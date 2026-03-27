package com.example.springboot.repository;

import com.example.springboot.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import org.springframework.web.bind.annotation.RestController;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

  Transaction findAllById(long id);
}
