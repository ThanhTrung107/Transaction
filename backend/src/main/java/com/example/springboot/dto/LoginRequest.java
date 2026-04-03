package com.example.springboot.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LoginRequest {
  @NotBlank(message = "Username không được để trống")
  private String username;

  @NotBlank(message = "Password không được để trống")
  private String password;
}
