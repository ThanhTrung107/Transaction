package com.example.springboot.dto;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DetailCreationRequest {
  @NotNull(message = "Loại thẻ không được để trống")
  private long card_type;
  @NotNull(message = "Giá trị của thẻ không được để trống")
  @Min(value = 1, message = "Giá trị thẻ không được âm")
  private long value;
  @NotNull(message = "Số lượng thẻ không được để trống")
  @Min(value = 0, message = "Số lượng thẻ không được âm")
  private long quantity;
  @NotNull(message = "Tổng tiền không được để trống")
  @Min(value = 0, message = "Tổng tiền không được âm")
  private long sub_total;
}
