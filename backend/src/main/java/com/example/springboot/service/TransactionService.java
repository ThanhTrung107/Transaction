package com.example.springboot.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.springboot.dto.DetailCreationRequest;
import com.example.springboot.dto.TransactionCreationRequest;
import com.example.springboot.entity.Detail;
import com.example.springboot.entity.Transaction;
import com.example.springboot.repository.DetailRepository;
import com.example.springboot.repository.TransactionRepository;

import jakarta.transaction.Transactional;

@Service
public class TransactionService {
  @Autowired
  private TransactionRepository transactionRepository;
  @Autowired
  private DetailRepository detailRepository;
  public List<Transaction> getTransactions(){
    return transactionRepository.findAll();
  }

  public Transaction getTransactionbyID(long id) {
    return transactionRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Không tìm thấy giao dịch với ID: " + id));
  }

  @Transactional
  public Transaction createTransaction(TransactionCreationRequest request) {
    // 1. Validate details không rỗng khi create
    if (request.getDetails() == null || request.getDetails().isEmpty()) {
      throw new IllegalArgumentException("Đơn hàng phải có ít nhất một mặt hàng");
    }

    // 2. Khởi tạo Transaction
    Transaction transaction = new Transaction();
    transaction.setCustomer_phone(request.getCustomer_phone());
    transaction.setStatus(request.getStatus());
    transaction.setCreated_at(new Date());

    // 3. Chuyển đổi DTO sang Entity và tính tổng tiền
    long totalSum = 0;
    List<Detail> details = new ArrayList<>();

    for (DetailCreationRequest dReq : request.getDetails()) {
      // Validate từng detail
      if (dReq.getValue() <= 0) {
        throw new IllegalArgumentException("Giá trị chi tiết phải lớn hơn 0");
      }
      if (dReq.getQuantity() <= 0) {
        throw new IllegalArgumentException("Số lượng chi tiết phải lớn hơn 0");
      }
      if (dReq.getCard_type() < 0) {
        throw new IllegalArgumentException("Loại thẻ không được để trống");
      }

      long subTotal = dReq.getValue() * dReq.getQuantity();
      Detail detail = Detail.builder()
        .card_type(dReq.getCard_type())
        .value(dReq.getValue())
        .quantity(dReq.getQuantity())
        .sub_total(subTotal) // Tự tính sub_total để đảm bảo chính xác
        .transaction(transaction) // Gán ngược lại cha
        .build();

      totalSum += subTotal;
      details.add(detail);
    }

    // 4. Validate total từ frontend với tính toán backend
    if (request.getTotal() != totalSum) {
      throw new IllegalArgumentException(
        "Tổng tiền không khớp. Frontend: " + request.getTotal() +
        ", Backend: " + totalSum
      );
    }

    transaction.setTotal(totalSum);
    transaction.setDetails(details);

    return transactionRepository.save(transaction);
  }


  @Transactional
  public Transaction updateTransaction(
    long id,
    TransactionCreationRequest request) {

    transactionRepository.deleteById(id);
    return this.createTransaction(request);

  }
  public void deleteTransaction(long id) {
    transactionRepository.deleteById(id);
  }
}
