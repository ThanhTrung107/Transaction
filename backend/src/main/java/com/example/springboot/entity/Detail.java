package com.example.springboot.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Setter
@Getter
@Table(name = "Transaction_Detail")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Detail {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;
  @ManyToOne
  @JoinColumn(name = "TRANSACTION_ID")
  @JsonIgnore
  private Transaction transaction;
  @Column(name = "CARD_TYPE")
  private long card_type;
  @Column(name = "VALUE")
  private long value;
  @Column(name = "QUANTITY")
  private long quantity;
  @Column(name = "SUB_TOTAL")
  private long sub_total;
}
