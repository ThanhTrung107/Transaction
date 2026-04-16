package com.example.springboot.dto;

import java.time.LocalDateTime;

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
public class ErrorResponse {
  private String status;        // "error"
  private String message;       // Error message
  private LocalDateTime timestamp;
  private String path;          // Request path
  private int statusCode;       // HTTP status code
}
