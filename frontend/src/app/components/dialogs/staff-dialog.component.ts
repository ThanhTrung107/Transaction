import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { StaffService, StaffCreation } from '../../services/staff.service';

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
  styles: `
    ::ng-deep .p-dialog-mask {
      background: radial-gradient(circle at center, rgba(15, 23, 42, 0.45), rgba(2, 6, 23, 0.82));
    }
    ::ng-deep .p-dialog {
      background: #f8fafc;
      box-shadow: 0 24px 70px rgba(15, 23, 42, 0.35);
      border-radius: 16px;
      overflow: hidden;
    }
    ::ng-deep .p-dialog .p-dialog-header {
      background: linear-gradient(135deg, #0f766e, #0e7490);
      border-bottom: 0;
      padding: 1rem 1.25rem;
    }
    ::ng-deep .p-dialog .p-dialog-title {
      color: #ffffff;
      font-weight: 700;
      font-size: 1.15rem;
      letter-spacing: 0.01em;
    }
    ::ng-deep .p-dialog .p-dialog-header-icons .p-dialog-header-close {
      color: #e2e8f0;
    }
    ::ng-deep .p-dialog .p-dialog-content {
      padding: 1.25rem;
      background: #f8fafc;
    }
    ::ng-deep .p-dialog .p-dialog-footer {
      background: #f8fafc;
      padding: 0 1.25rem 1.25rem;
    }
  `,
  template: `
    <p-dialog [(visible)]="display" [modal]="true" [header]="isEdit ? 'Cập nhật Nhân Viên' : 'Tạo Nhân Viên'" 
              [style]="{ width: '760px', maxWidth: '95vw' }" [maximizable]="true" [showHeader]="true" (onShow)="onDialogShow()" (onHide)="onHide()">
      <div class="space-y-4 pb-4">
        <div class="rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900">
          <span class="font-semibold">Gợi ý:</span> Chọn đúng vai trò nhân viên để hệ thống phân quyền phù hợp.
        </div>

        <form (ngSubmit)="onSubmit()" autocomplete="on">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <!-- Staff Code -->
            <div>
              <label for="staffCode" class="mb-1 block text-sm font-semibold text-slate-700">Mã Nhân Viên</label>
              <input 
                id="staffCode"
                type="text"
                [(ngModel)]="formData.staffCode" 
                name="staffCode" 
                autocomplete="off"
                class="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                placeholder="VD: EMP001" />
              <span class="text-red-500 text-xs mt-1 block" *ngIf="errors['staffCode']">{{ errors['staffCode'] }}</span>
            </div>

            <!-- Staff Name -->
            <div>
              <label for="staffName" class="mb-1 block text-sm font-semibold text-slate-700">Tên Nhân Viên</label>
              <input 
                id="staffName"
                type="text"
                [(ngModel)]="formData.staffName" 
                name="staffName" 
                autocomplete="name"
                class="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                placeholder="VD: Nguyễn Văn A" />
              <span class="text-red-500 text-xs mt-1 block" *ngIf="errors['staffName']">{{ errors['staffName'] }}</span>
            </div>

            <!-- Staff Type -->
            <div>
              <label for="staffType" class="mb-1 block text-sm font-semibold text-slate-700">Loại Nhân Viên</label>
              <select
                id="staffType"
                [(ngModel)]="formData.staffType" 
                name="staffType" 
                autocomplete="off"
                class="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100"
              >
                <option value="">-- Chọn vai trò --</option>
                <option *ngFor="let role of staffTypeOptions" [ngValue]="role.value">{{ role.label }}</option>
              </select>
              <span class="text-red-500 text-xs mt-1 block" *ngIf="errors['staffType']">{{ errors['staffType'] }}</span>
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="mb-1 block text-sm font-semibold text-slate-700">Email</label>
              <input 
                id="email"
                type="email" 
                [(ngModel)]="formData.email" 
                name="email" 
                autocomplete="email"
                class="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                placeholder="email@example.com" />
              <span class="text-red-500 text-xs mt-1 block" *ngIf="errors['email']">{{ errors['email'] }}</span>
            </div>

            <!-- ID Number -->
            <div>
              <label for="idNumber" class="mb-1 block text-sm font-semibold text-slate-700">Số CMND/CCCD</label>
              <input 
                id="idNumber"
                type="text"
                [(ngModel)]="formData.idNumber" 
                name="idNumber" 
                autocomplete="off"
                class="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                placeholder="VD: 123456789" />
              <span class="text-red-500 text-xs mt-1 block" *ngIf="errors['idNumber']">{{ errors['idNumber'] }}</span>
            </div>

            <!-- Phone Number -->
            <div>
              <label for="phoneNumber" class="mb-1 block text-sm font-semibold text-slate-700">Số Điện Thoại</label>
              <input 
                id="phoneNumber"
                type="tel"
                [(ngModel)]="formData.phoneNumber" 
                name="phoneNumber" 
                autocomplete="tel-national"
                maxlength="10"
                class="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100" 
                placeholder="0123456789" />
              <span class="text-red-500 text-xs mt-1 block" *ngIf="errors['phoneNumber']">{{ errors['phoneNumber'] }}</span>
            </div>

            <!-- Address -->
            <div>
              <label for="address" class="mb-1 block text-sm font-semibold text-slate-700">Địa Chỉ</label>
              <input 
                id="address"
                type="text"
                [(ngModel)]="formData.address" 
                name="address" 
                autocomplete="street-address"
                class="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                placeholder="Nhập địa chỉ" />
            </div>

            <!-- Birth Day -->
            <div>
              <label for="birthDay" class="mb-1 block text-sm font-semibold text-slate-700">Ngày Sinh</label>
              <p-calendar [(ngModel)]="formData.birthDay" name="birthDay" inputId="birthDay"
                          dateFormat="dd/mm/yy"
                          styleClass="w-full">
              </p-calendar>
            </div>

            <!-- Status -->
            <div>
              <label for="status" class="mb-1 block text-sm font-semibold text-slate-700">Trạng Thái</label>
              <input 
                id="status"
                type="text"
                [(ngModel)]="formData.status" 
                name="status" 
                autocomplete="off"
                class="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                placeholder="Nhập trạng thái" />
              <span class="text-red-500 text-xs mt-1 block" *ngIf="errors['status']">{{ errors['status'] }}</span>
            </div>

            <!-- Description -->
            <div class="col-span-2">
              <label for="desciption" class="mb-1 block text-sm font-semibold text-slate-700">Mô Tả</label>
              <textarea 
                id="desciption"
                [(ngModel)]="formData.desciption" 
                name="desciption"
                autocomplete="off"
                class="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                rows="2" 
                placeholder="Nhập mô tả (tùy chọn)"></textarea>
            </div>
          </div>

          <!-- Error Message -->
          <div class="text-red-600 text-sm p-3 bg-red-50 rounded mt-4" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>
        </form>
      </div>

      <ng-template pTemplate="footer">
        <div class="flex justify-end gap-3 border-t border-slate-200 pt-4">
          <button 
            class="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-50"
            (click)="onCancel()">
            Hủy
          </button>
          <button 
            class="rounded-lg bg-cyan-700 px-4 py-2 font-semibold text-white transition hover:bg-cyan-800"
            (click)="onSubmit()">
            {{ isEdit ? 'Cập nhật' : 'Tạo mới' }}
          </button>
        </div>
      </ng-template>
    </p-dialog>
  `
})
export class StaffDialogComponent implements OnChanges {
  @Input() display = false;
  @Input() isEdit = false;
  @Input() selectedStaffId: number | null = null;
  @Input() departmentId: number | null = null;
  @Output() displayChange = new EventEmitter<boolean>();
  @Output() onSave = new EventEmitter<StaffCreation>();

  readonly staffTypeOptions = [
    { label: 'Nhân viên', value: '1' },
    { label: 'Trưởng phòng', value: '2' },
    { label: 'Phó phòng', value: '3' },
    { label: 'Giám đốc', value: '4' },
    { label: 'P.Giám đốc', value: '5' }
  ];

  formData: StaffCreation = {
    staffCode: '',
    staffName: '',
    staffType: '',
    depId: 0,
    email: '',
    idNumber: '',
    phoneNumber: '',
    address: '',
    desciption: '',
    status: '1',
    birthDay: undefined
  };

  errors: { [key: string]: string } = {};
  errorMessage = '';
  isSubmitting = false;

  constructor(private staffService: StaffService) {}

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
    this.errors = {};
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
    if (!this.validate()) {
      return;
    }

    this.isSubmitting = true;
    const request = this.isEdit && this.selectedStaffId
      ? this.staffService.updateStaff(this.selectedStaffId, this.formData)
      : this.staffService.createStaff(this.departmentId!, this.formData);

    request.subscribe({
      next: (result) => {
        this.isSubmitting = false;
        this.onSave.emit(result);
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
    this.displayChange.emit(false);
  }

  private validate(): boolean {
    this.errors = {};

    if (!this.formData.staffCode || this.formData.staffCode.trim() === '') {
      this.errors['staffCode'] = 'Mã nhân viên không được để trống';
    } else if (this.formData.staffCode.length > 50) {
      this.errors['staffCode'] = 'Mã nhân viên không được vượt quá 50 ký tự';
    }

    if (!this.formData.staffName || this.formData.staffName.trim() === '') {
      this.errors['staffName'] = 'Tên nhân viên không được để trống';
    } else if (this.formData.staffName.length > 100) {
      this.errors['staffName'] = 'Tên nhân viên không được vượt quá 100 ký tự';
    }

    if (!this.formData.staffType || this.formData.staffType.trim() === '') {
      this.errors['staffType'] = 'Loại nhân viên không được để trống';
    } else if (this.formData.staffType.length > 1) {
      this.errors['staffType'] = 'Loại nhân viên chỉ có 1 ký tự';
    }

    if (!this.formData.email || this.formData.email.trim() === '') {
      this.errors['email'] = 'Email không được để trống';
    } else if (this.formData.email.length > 50) {
      this.errors['email'] = 'Email không được vượt quá 50 ký tự';
    } else if (!this.isValidEmail(this.formData.email)) {
      this.errors['email'] = 'Email không hợp lệ';
    }

    if (!this.formData.idNumber || this.formData.idNumber.trim() === '') {
      this.errors['idNumber'] = 'Số CMND/CCCD không được để trống';
    } else if (this.formData.idNumber.length > 20) {
      this.errors['idNumber'] = 'Số CMND/CCCD không được vượt quá 20 ký tự';
    }

    if (!this.formData.phoneNumber || this.formData.phoneNumber.trim() === '') {
      this.errors['phoneNumber'] = 'Số điện thoại không được để trống';
    } else if (!this.isValidPhone(this.formData.phoneNumber)) {
      this.errors['phoneNumber'] = 'Số điện thoại phải đúng 10 chữ số';
    }

    if (!this.formData.status || this.formData.status.trim() === '') {
      this.errors['status'] = 'Trạng thái không được để trống';
    }

    return Object.keys(this.errors).length === 0;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
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
    this.errors = {};
    this.errorMessage = '';
  }
}
