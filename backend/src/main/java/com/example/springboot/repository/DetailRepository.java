package com.example.springboot.repository;

import com.example.springboot.entity.Detail;
import com.example.springboot.entity.Transaction;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DetailRepository extends JpaRepository<Detail, Long> {
  List<Detail> findByTransaction_Id(long transactionID);

  @Query("SELECT d FROM Detail d WHERE d.transaction = :transaction AND d.card_type = :cardType AND d.value = :value")
  Optional<Detail> findDuplicateDetail(
    @Param("transaction") Transaction transaction,
    @Param("cardType") long cardType,
    @Param("value") long value
  );
  @Modifying
  @Transactional
  @Query("DELETE FROM Detail d WHERE d.transaction.id = :transactionId")
  void deleteByTransactionId(@Param("transactionId") long transactionId);
}
