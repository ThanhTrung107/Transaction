package com.example.springboot.exception;

import com.example.springboot.dto.ErrorResponse;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

  private String extractPath(WebRequest request) {
    return request.getDescription(false).replace("uri=", "");
  }

  @ExceptionHandler(AppException.class)
  public ResponseEntity<ErrorResponse> handleAppException(
    AppException ex,
    WebRequest request) {
      
    AppHttpStatus status = ex.getAppHttpStatus();

    ErrorResponse errorResponse = ErrorResponse.builder()
      .status("error")
      .customCode(status.getCustomCode())
      .message(ex.getMessage() != null ? ex.getMessage() : status.getMessage())
      .timestamp(LocalDateTime.now())
      .path(extractPath(request))
      .statusCode(status.getHttpCode())
      .build();

    return ResponseEntity.status(status.getHttpCode()).body(errorResponse);
  }

  @ExceptionHandler(RuntimeException.class)
  public ResponseEntity<ErrorResponse> handleRuntimeException(
    RuntimeException ex,
    WebRequest request) {

    ErrorResponse errorResponse = ErrorResponse.builder()
      .status("error")
      .customCode("40000") // Mặc định BAD_REQUEST
      .message(ex.getMessage() != null ? ex.getMessage() : "Lỗi hệ thống")
      .timestamp(LocalDateTime.now())
      .path(extractPath(request))
      .statusCode(HttpStatus.BAD_REQUEST.value())
      .build();

    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleValidationException(
    MethodArgumentNotValidException ex,
    WebRequest request) {

    String message = ex.getBindingResult().getFieldErrors().stream()
      .map(error -> error.getField() + ": " + error.getDefaultMessage())
      .reduce((m1, m2) -> m1 + "; " + m2)
      .orElse("Dữ liệu không hợp lệ");

    ErrorResponse errorResponse = ErrorResponse.builder()
      .status("error")
      .customCode("40000")
      .message(message)
      .timestamp(LocalDateTime.now())
      .path(extractPath(request))
      .statusCode(HttpStatus.BAD_REQUEST.value())
      .build();

    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleGenericException(
    Exception ex,
    WebRequest request) {

    ErrorResponse errorResponse = ErrorResponse.builder()
      .status("error")
      .customCode("50000")
      .message("Đã xảy ra lỗi: " + (ex.getMessage() != null ? ex.getMessage() : "Unknown error"))
      .timestamp(LocalDateTime.now())
      .path(extractPath(request))
      .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
      .build();

    return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  @ExceptionHandler(DataIntegrityViolationException.class)
  public ResponseEntity<ErrorResponse> handleDataIntegrityViolationException(
    DataIntegrityViolationException ex,
    WebRequest request) {

    String message = "Lỗi ràng buộc dữ liệu (Cập nhật hoặc xóa không hợp lệ)";
    String customCode = "40000";

    // Bắt riêng lỗi không thể xóa phòng ban do còn chứa bản ghi con
    if (ex.getMessage() != null && (ex.getMessage().contains("ORA-02292") || ex.getMessage().contains("child record found") || ex.getMessage().contains("violated"))) {
      message = "Phòng ban (hoặc dữ liệu nhánh) hiện đang chứa nhân viên hoặc dữ liệu con, không thể xóa trực tiếp.";
      customCode = "40003"; // Ví dụ mã lỗi Custom Code của Constrain / Khoá ngoại
    }

    ErrorResponse errorResponse = ErrorResponse.builder()
      .status("error")
      .customCode(customCode)
      .message(message)
      .timestamp(LocalDateTime.now())
      .path(extractPath(request))
      .statusCode(HttpStatus.CONFLICT.value()) // HTTP 409 Xung đột logic cấu trúc
      .build();

    return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
  }
}
