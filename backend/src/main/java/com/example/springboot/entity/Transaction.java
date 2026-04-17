package com.example.springboot.entity;

import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "Transaction")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Transaction {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "ID")
  private long id;
  @Column(name = "CUSTOMER_PHONE")
  private String customerPhone;
  @Column(name = "TOTAL")
  private long total;
  @Column(name = "STATUS")
  private long status;
  @Column(name = "CREATED_AT")
  private Date createdAt;

  @OneToMany(mappedBy = "transaction", cascade = CascadeType.ALL)
  @NotEmpty(message = "Giao dịch phải có ít nhất một mặt hàng chi tiết")
  @Valid
  private List<Detail> details;
}
