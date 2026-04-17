package com.example.springboot.controller;

import com.example.springboot.dto.LoginRequest;
import com.example.springboot.dto.RegisterCreationRequest;
import com.example.springboot.entity.Account;
import com.example.springboot.service.AccountService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

  @Autowired
  private AccountService accountService;

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody @Valid LoginRequest request) {
    // Logic xác thực: AccountService sẽ so sánh mật khẩu đã băm trong DB
    Optional<Account> accountOpt = accountService.authenticate(
      request.getUsername(),
      request.getPassword()
    );

    if (accountOpt.isPresent()) {
      Account account = accountOpt.get();

      Map<String, Object> response = Map.of(
        "username", account.getUsername(),
        "role", account.getRole(),
        "message", "Đăng nhập thành công"
      );

      return ResponseEntity.ok(response);
    }

    return ResponseEntity
      .status(HttpStatus.UNAUTHORIZED)
      .body(Map.of("error", "Tài khoản hoặc mật khẩu không đúng"));
  }

  @PostMapping("/register")
  public ResponseEntity<?> register(@RequestBody @Valid RegisterCreationRequest request) {
    if (accountService.existsByUsername(request.getUsername())) {
      return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(Map.of("error", "Username đã tồn tại"));
    }

    if (!request.getPassword().equals(request.getConfirmPassword())) {
      return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(Map.of("error", "Mật khẩu xác nhận không khớp"));
    }

    // AccountService.register sẽ thực hiện băm mật khẩu trước khi lưu
    Account newAccount = accountService.register(request);

    return ResponseEntity
      .status(HttpStatus.CREATED)
      .body(Map.of(
        "message", "Đăng ký thành công",
        "username", newAccount.getUsername()
      ));
  }
}
