import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, RegisterRequest } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username = '';
  password = '';
  confirmPassword = '';
  role = 'USER';
  fieldErrors: { [key: string]: string } = {};
  successMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  validateFields(): boolean {
    this.fieldErrors = {};
    
    if (!this.username) {
      this.fieldErrors['username'] = 'Tên đăng nhập không được để trống';
    }
    if (!this.password) {
      this.fieldErrors['password'] = 'Mật khẩu không được để trống';
    }
    if (!this.confirmPassword) {
      this.fieldErrors['confirmPassword'] = 'Xác nhận mật khẩu không được để trống';
    } else if (this.password !== this.confirmPassword) {
      this.fieldErrors['confirmPassword'] = 'Mật khẩu xác nhận không khớp';
    }
    
    return Object.keys(this.fieldErrors).length === 0;
  }

  onSubmit(): void {
    if (!this.validateFields()) {
      this.successMessage = '';
      return;
    }

    this.isLoading = true;
    this.fieldErrors = {};
    this.successMessage = '';

    // Uppercase username trước khi gửi
    const uppercaseUsername = this.username.toUpperCase();
    const request: RegisterRequest = {
      username: uppercaseUsername,
      password: this.password,
      confirmPassword: this.confirmPassword,
      role: this.role
    };

    this.authService.register(request).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Đăng ký thành công! Chuyển hướng đến trang đăng nhập...';
       
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (error) => {
        this.isLoading = false;
        const errorMsg = error.error?.error || 'Đăng ký thất bại. Vui lòng thử lại';
        this.fieldErrors['general'] = errorMsg;
        this.successMessage = '';
      }
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
