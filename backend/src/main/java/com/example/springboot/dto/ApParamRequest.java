package com.example.springboot.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApParamRequest {
  @NotBlank(message = "Tên vị trí không được để trống")
  private String parName;
  @NotBlank(message = "Giá trị của vị trí không được để trống")
  private String parValue;
}
