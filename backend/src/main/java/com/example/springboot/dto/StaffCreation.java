package com.example.springboot.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffCreation {

  private Long id;

  @NotBlank(message = "Mã nhân viên không được để trống")
  private String staffCode;

  @NotBlank(message = "Tên nhân viên không được để trống")
  private String staffName;

  @NotBlank(message = "Loại nhân viên không được để trống")
  @Pattern(regexp = "[1-5]", message = "Loại nhân viên phải từ 1-5")
  private String staffType;

  private String staffTypeName;

  @NotNull(message = "Phòng ban không được để trống")
  private Long depId;

  @NotBlank(message = "Email không được để trống")
  @Email(message = "Email không hợp lệ")
  private String email;

  @NotBlank(message = "Số CMND không được để trống")
  private String idNumber;

  @NotBlank(message = "Số điện thoại không được để trống")
  @Pattern(regexp = "\\d{10}", message = "Số điện thoại phải gồm 10 chữ số")
  private String phoneNumber;

  private String desciption;

  @Pattern(regexp = "[01]", message = "Trạng thái phải là 0 hoặc 1")
  private String status;

  private String address;
  private Date birthDay;
}
