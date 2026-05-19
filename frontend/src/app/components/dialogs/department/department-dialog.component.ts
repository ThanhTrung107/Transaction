import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DepartmentTree, DepartmentService } from '../../../services/department.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-department-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule
  ],
  templateUrl: './department-dialog.component.html',
  styleUrl: './department-dialog.component.css'
})
export class DepartmentDialogComponent implements OnChanges {
  @Input() display = false;
  @Input() isEdit = false;
  @Input() parentDepartments: DepartmentTree[] = [];
  @Input() selectedDepartmentId: number | null = null;
  @Output() displayChange = new EventEmitter<boolean>();
  @Output() onSave = new EventEmitter<DepartmentTree>();
  @ViewChild('departmentForm') departmentForm!: NgForm;

  formData: DepartmentTree = {
    code: '',
    name: '',
    description: '',
    parentId: null
  };

  errorMessage = '';
  isSubmitting = false;

  constructor(
    private departmentService: DepartmentService,
    private notificationService: NotificationService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const displayChange = changes['display'];
    const dialogJustOpened = displayChange?.currentValue === true
      && (displayChange?.previousValue === false || displayChange?.firstChange);

    if (!dialogJustOpened) {
      return;
    }

    if (this.isEdit && this.selectedDepartmentId) {
      this.departmentService.getDepartmentById(this.selectedDepartmentId).subscribe({
        next: (data) => {
          this.formData = { ...data };
        },
        error: (error) => {
          this.errorMessage = 'Không thể tải dữ liệu phòng ban: ' + (error?.error?.message || error?.message || 'Unknown error');
        }
      });
    } else if (!this.isEdit) {
      this.resetForm();
    }
  }

  onSubmit(): void {
    if (!this.departmentForm.valid) {
      this.markFormGroupTouched(this.departmentForm);
      return;
    }

    this.isSubmitting = true;
    const request = this.isEdit
      ? this.departmentService.updateDepartment(this.selectedDepartmentId!, this.formData)
      : this.departmentService.createDepartment(this.formData);

    request.subscribe({
      next: (result) => {
        this.isSubmitting = false;
        const message = this.isEdit 
          ? 'Cập nhật phòng ban thành công' 
          : 'Tạo phòng ban thành công';
        this.notificationService.showSuccess(message);
        this.onSave.emit(result);
        this.resetForm();
        this.departmentForm?.resetForm(this.formData);
        this.displayChange.emit(false);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error?.error?.message || 'Có lỗi xảy ra';
      }
    });
  }

  onCancel(): void {
    this.displayChange.emit(false);
  }

  onHide(): void {
    this.resetForm();
    this.departmentForm?.resetForm(this.formData);
    this.displayChange.emit(false);
  }

  private resetForm(): void {
    this.formData = {
      code: '',
      name: '',
      description: '',
      parentId: null
    };
    this.errorMessage = '';
  }

  private markFormGroupTouched(formGroup: NgForm): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.controls[key];
      control?.markAsTouched();
    });
  }
}
