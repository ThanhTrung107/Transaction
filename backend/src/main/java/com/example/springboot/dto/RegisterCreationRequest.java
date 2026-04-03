package com.example.springboot.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegisterCreationRequest {
  @NotBlank(message = "Username không được để trống")
  private String username;

  @NotBlank(message = "Password không được để trống")
  private String password;

  @NotBlank(message = "Xác nhận password không được để trống")
  private String confirmPassword;

  @NotBlank(message = "Vai trò không được để trống")
  @Pattern(regexp = "^(USER|ADMIN)$", message = "Role phải là USER hoặc ADMIN")
  private String role;
}
