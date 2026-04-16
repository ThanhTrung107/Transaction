package com.example.springboot.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "DEPARTMENT")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Department {
  @Id
  @Column(name = "DEPARTMENT_ID")
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "department_seq_gen")
  @SequenceGenerator(name = "department_seq_gen", sequenceName = "DEPARTMENT_SEQ", allocationSize = 1)
  private Long id;

  @Column(name = "CODE", nullable = false, unique = true, length = 50)
  private String code;

  @Column(name = "NAME", nullable = false, length = 100)
  private String name;

  @Column(name = "STATUS", length = 1)
  private String status;

  @Column(name = "PARENT_ID")
  private Long parentId;

  @Column(name = "DESCRIPTION", length = 2000)
  private String description;

  // Quan hệ cha - con
  @ManyToOne
  @JoinColumn(name = "PARENT_ID", insertable = false, updatable = false)
  private Department parent;

  @OneToMany(mappedBy = "parent")
  private List<Department> children;

  // Quan hệ với Staff
  @OneToMany(mappedBy = "department")
  private List<Staff> staffList;
}
