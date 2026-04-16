package com.example.springboot.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Table(name = "STAFF_NEW")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Staff {
  @Id
  @Column(name = "STAFF_ID")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "STAFF_CODE", nullable = false, unique = true, length = 50)
  private String staffCode;

  @Column(name = "STAFF_NAME", nullable = false, length = 100)
  private String staffName;

  @Column(name = "STAFF_TYPE", nullable = false, length = 1)
  private String staffType;

  @Column(name = "ID_NUMBER", nullable = false, length = 20)
  private String idNumber;

  @Column(name = "EMAIL", nullable = false, length = 50)
  private String email;

  @Column(name = "PHONE_NUMBER", nullable = false, length = 50)
  private String phoneNumber;

  @Column(name = "ADDRESS", length = 50)
  private String address;

  @Column(name = "STATUS", length = 1)
  private String status;

  @Column(name = "DESCRIPTION", length = 2000)
  private String description;

  @Column(name = "BIRTH_DAY")
  @Temporal(TemporalType.DATE)
  private Date birthDay;

  // Foreign key
  @Column(name = "DEP_ID", nullable = false)
  private Long depId;

  // Mapping ManyToOne
  @ManyToOne
  @JoinColumn(name = "DEP_ID", insertable = false, updatable = false)
  private Department department;
}
