import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { StaffService, StaffCreation, StaffType } from '../../../services/staff.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-staff-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    CalendarModule
  ],
  templateUrl: './staff-dialog.component.html',
  styleUrl: './staff-dialog.component.css'
})
export class StaffDialogComponent implements OnChanges, OnInit {
  @Input() display = false;
  @Input() isEdit = false;
  @Input() selectedStaffId: number | null = null;
  @Input() departmentId: number | null = null;
  @Input() staffTypeOptions: StaffType[] = [];
  @Output() displayChange = new EventEmitter<boolean>();
  @Output() onSave = new EventEmitter<StaffCreation>();
  @ViewChild('staffForm') staffForm!: NgForm;

  formData!: StaffCreation;

  errorMessage = '';
  isSubmitting = false;

  constructor(
    private staffService: StaffService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.resetForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.display) {
      return;
    }

    const displayOpened = !!changes['display'] && changes['display'].currentValue === true;
    const editInputsChanged = !!changes['isEdit'] || !!changes['selectedStaffId'] || !!changes['departmentId'];
    if (!displayOpened && !editInputsChanged) {
      return;
    }

    if (this.isEdit && !this.selectedStaffId) {
      return;
    }

    this.initializeDialogData();
  }

  onDialogShow(): void {
    if (this.isEdit && !this.selectedStaffId) {
      return;
    }

    this.initializeDialogData();
  }

  private initializeDialogData(): void {
    this.resetForm();
    this.errorMessage = '';

    if (this.isEdit && this.selectedStaffId) {
      this.staffService.getStaffById(this.selectedStaffId).subscribe({
        next: (data) => {
          this.formData = {
            ...data,
            staffType: data.staffType ? String(data.staffType) : '',
            birthDay: data.birthDay ? new Date(data.birthDay) : undefined
          };
        },
        error: (error) => {
          this.errorMessage = 'Không thể tải dữ liệu nhân viên: '
            + (error?.error?.message || error?.message || 'Unknown error');
        }
      });
      return;
    }

    if (this.isEdit && !this.selectedStaffId) {
      return;
    }

    if (this.departmentId) {
      this.formData.depId = this.departmentId;
    }
  }

  onSubmit(): void {
    if (!this.staffForm?.valid) {
      return;
    }

    this.isSubmitting = true;

    // Remove staffId form old properties, guarantee depId and Id correctness
    if (this.isEdit && this.selectedStaffId) {
      this.formData.id = this.selectedStaffId;
    } else {
      this.formData.id = undefined;
    }
    
    this.formData.depId = this.departmentId!;

    const request = this.staffService.saveStaff(this.formData);

    request.subscribe({
      next: (result) => {
        this.isSubmitting = false;
        const message = this.isEdit 
          ? 'Cập nhật nhân viên thành công' 
          : 'Tạo nhân viên thành công';
        this.notificationService.showSuccess(message);
        this.onSave.emit(result);
        this.resetForm();
        this.staffForm?.resetForm(this.formData);
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
    this.staffForm?.resetForm(this.formData);
    this.displayChange.emit(false);
  }

  private resetForm(): void {
    this.formData = {
      staffCode: '',
      staffName: '',
      staffType: '',
      depId: this.departmentId || 0,
      email: '',
      idNumber: '',
      phoneNumber: '',
      address: '',
      desciption: '',
      status: '1',
      birthDay: undefined
    };
    this.errorMessage = '';
  }
}