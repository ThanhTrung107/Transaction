package com.example.springboot.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentTree {

  private Long id;

  @NotBlank(message = "Mã phòng ban không được để trống")
  private String code;

  @NotBlank(message = "Tên phòng ban không được để trống")
  private String name;

  private Long parentId;
  private String description;
  private List<DepartmentTree> children = new ArrayList<>();

  public DepartmentTree(Long id, String code, String name, Long parentId) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.parentId = parentId;
    this.children = new ArrayList<>();
  }
}
