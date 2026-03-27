package com.example.springboot.controller;

import com.example.springboot.dto.DetailCreationRequest;
import com.example.springboot.entity.Detail;
import com.example.springboot.service.DetailService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/detail")
public class DetailController {
  @Autowired
  private DetailService detailService;

  @GetMapping("/{transactionId}")
  public List<Detail> getDetailByTransactionID(@PathVariable long transactionId) {
    return detailService.getDetailByTransactionID(transactionId);
  }

  @PostMapping("/{transactionId}")
  public Detail createDetail(@PathVariable long transactionId, @RequestBody @Valid DetailCreationRequest request) {
    return detailService.createDetail(transactionId, request);
  }

  @PutMapping("/{detailId}")
  public Detail updateSalary(@PathVariable long detailId, @RequestBody @Valid DetailCreationRequest request) {
    return detailService.updateDetail(detailId, request);
  }

  @DeleteMapping("/{detailId}")
  public void deleteDetail(@PathVariable long detailId) {
    detailService.deleteDetail(detailId);
  }
}
