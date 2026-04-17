package com.example.springboot.exception;

import com.example.springboot.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(RuntimeException.class)
  public ResponseEntity<ErrorResponse> handleRuntimeException(
    RuntimeException ex,
    WebRequest request) {

    ErrorResponse errorResponse = ErrorResponse.builder()
      .status("error")
      .message(ex.getMessage() != null ? ex.getMessage() : "Lỗi hệ thống")
      .timestamp(LocalDateTime.now())
      .path(request.getDescription(false).replace("uri=", ""))
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
      .message(message)
      .timestamp(LocalDateTime.now())
      .path(request.getDescription(false).replace("uri=", ""))
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
      .message("Đã xảy ra lỗi: " + (ex.getMessage() != null ? ex.getMessage() : "Unknown error"))
      .timestamp(LocalDateTime.now())
      .path(request.getDescription(false).replace("uri=", ""))
      .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
      .build();

    return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
