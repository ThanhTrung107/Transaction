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
  private long id;
  private String customer_phone;
  private long total;
  private long status;
  @Column(name = "CREATED_AT")
  private Date created_at;

  @OneToMany(mappedBy = "transaction", cascade = CascadeType.ALL)
  @NotEmpty(message = "Giao dịch phải có ít nhất một mặt hàng chi tiết")
  @Valid
  private List<Detail> details;
}
