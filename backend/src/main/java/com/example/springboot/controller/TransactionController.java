package com.example.springboot.controller;

import com.example.springboot.dto.TransactionCreationRequest;
import com.example.springboot.entity.Transaction;
import com.example.springboot.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transactions")
public class TransactionController {
  @Autowired
  private TransactionService transactionService;

  @GetMapping
  List<Transaction> getTransactions(){
    return transactionService.getTransactions();
  }

  @PostMapping
  public Transaction createTransaction(@RequestBody @Valid TransactionCreationRequest request) {
    return transactionService.createTransaction(request);
  }

  @GetMapping("/{id}")
  public Transaction getTransactionbyID(@PathVariable long id) {
    return transactionService.getTransactionbyID(id);
  }

  @PutMapping("/{id}")
  public Transaction updateTransaction(@PathVariable long id, @RequestBody @Valid TransactionCreationRequest request) {
    return transactionService.updateTransaction(id, request);
  }

//  @PutMapping("/{id}/full")
//  public Transaction updateTransactionFull(
//    @PathVariable long id,
//    @RequestBody @Valid UpdateTransactionFullRequest request) {
//    return transactionService.updateTransactionFull(id, request);
//  }

  @DeleteMapping("/{id}")
  public void deleteTransaction(@PathVariable long id) {
    transactionService.deleteTransaction(id);
  }
}
