package com.example.springboot.exception;

import lombok.Getter;

@Getter
public enum AppHttpStatus {
    // 2xx: Thành công
    SUCCESS(200, "20000", "Thao tác thành công"),
    CREATED(201, "20100", "Tạo mới tài nguyên thành công"),

    // 4xx: Lỗi từ phía Client (người dùng)
    BAD_REQUEST(400, "40000", "Dữ liệu đầu vào không hợp lệ"),
    UNAUTHORIZED(401, "40100", "Chưa xác thực hoặc token không hợp lệ"),
    FORBIDDEN(403, "40300", "Không có quyền truy cập tài nguyên này"),
    NOT_FOUND(404, "40400", "Không tìm thấy tài nguyên yêu cầu"),
    METHOD_NOT_ALLOWED(405, "40500", "Phương thức HTTP không được hỗ trợ"),
    USER_ALREADY_EXISTS(400, "40001", "Tên đăng nhập hoặc email đã tồn tại"),

    // 5xx: Lỗi từ phía Server
    INTERNAL_SERVER_ERROR(500, "50000", "Lỗi hệ thống nội bộ"),
    SERVICE_UNAVAILABLE(503, "50300", "Dịch vụ hiện không khả dụng");

    private final int httpCode;      
    private final String customCode; 
    private final String message;

    AppHttpStatus(int httpCode, String customCode, String message) {
        this.httpCode = httpCode;
        this.customCode = customCode;
        this.message = message;
    }
}
