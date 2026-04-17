package com.example.springboot.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TransactionCreationRequest {
  @Pattern(regexp = "^0\\d{9}$", message = "Số điện thoại phải đúng 10 chữ số")
  @NotBlank(message = "Số điện thoại không được để trống")
  private String customerPhone;
  @NotNull(message = "Trạng thái không được để trống")
  private long status;
  @NotEmpty(message = "Đơn hàng phải có ít nhất một mặt hàng")
  private List<DetailCreationRequest> details;
  @NotNull(message = "Tổng tiền không được để trống")
  @Min(value = 1, message = "Tổng tiền không được âm")
  private long total;
}
