package com.example.springboot.exception;

import lombok.Getter;

@Getter
public class AppException extends RuntimeException {
    private final AppHttpStatus appHttpStatus;

    public AppException(AppHttpStatus appHttpStatus) {
        super(appHttpStatus.getMessage());
        this.appHttpStatus = appHttpStatus;
    }
    
    // Tùy chọn nếu muốn ghi đè message mặc định của enum
    public AppException(AppHttpStatus appHttpStatus, String customMessage) {
        super(customMessage);
        this.appHttpStatus = appHttpStatus;
    }
}
