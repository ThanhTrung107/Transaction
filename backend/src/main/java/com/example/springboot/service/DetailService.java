package com.example.springboot.service;

import com.example.springboot.dto.DetailCreationRequest;
import com.example.springboot.entity.Detail;
import com.example.springboot.entity.Transaction;
import com.example.springboot.repository.DetailRepository;
import com.example.springboot.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DetailService {
  @Autowired
  private DetailRepository detailRepository;
  @Autowired
  private TransactionRepository transactionRepository;
  @Autowired
  private TransactionService transactionService;

  public List<Detail> getDetailByTransactionID(long transactionID) {
    return detailRepository.findByTransaction_Id(transactionID);
  }

  public Detail createDetail(long transactionID, DetailCreationRequest request) {
    Transaction transaction = transactionService.getTransactionbyID(transactionID);

    // Tạo detail mới - Frontend đã guard duplicate
    Detail detail = Detail.builder().transaction(transaction).card_type(request.getCard_type()).value(request.getValue()).quantity(request.getQuantity()).sub_total(request.getValue() * request.getQuantity()).build();

    return detailRepository.save(detail);
  }

  public Detail updateDetail(long detailId, DetailCreationRequest request) {
    Detail detail = detailRepository.findById(detailId).orElseThrow();
    Transaction transaction = detail.getTransaction();
    detail.setCard_type(request.getCard_type());
    detail.setValue(request.getValue());
    detail.setQuantity(request.getQuantity());
    detail.setSub_total(request.getValue() * request.getQuantity());

    detailRepository.save(detail);

    return detail;
  }

  public void deleteDetail(long detailId) {
    detailRepository.deleteById(detailId);
  }

}
