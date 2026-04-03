import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  fieldErrors: { [key: string]: string } = {};
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
    
    return Object.keys(this.fieldErrors).length === 0;
  }

  onSubmit(): void {
    if (!this.validateFields()) {
      return;
    }

    this.isLoading = true;
    this.fieldErrors = {};

    // Uppercase username trước khi gửi
    const uppercaseUsername = this.username.toUpperCase();
    this.authService.login(uppercaseUsername, this.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.isLoading = false;
        const errorMsg = error.error?.error || 'Đăng nhập thất bại. Vui lòng thử lại';
        this.fieldErrors['general'] = errorMsg;
      }
    });
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}
