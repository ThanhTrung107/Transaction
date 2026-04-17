import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { StaffService, StaffCreation, StaffType } from '../../services/staff.service';
import { NotificationService } from '../../services/notification.service';

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

        <form #staffForm="ngForm" (ngSubmit)="onSubmit()" autocomplete="on">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <!-- Staff Code -->
            <div>
              <label for="staffCode" class="mb-1 block text-sm font-semibold text-slate-700">Mã Nhân Viên <span class="text-red-500">*</span></label>
              <input 
                id="staffCode"
                type="text"
                [(ngModel)]="formData.staffCode" 
                name="staffCode"
                #staffCodeField="ngModel"
                required
                maxlength="50"
                autocomplete="off"
                class="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                placeholder="VD: EMP001" />
              <span class="text-red-500 text-xs mt-1 block" *ngIf="staffCodeField?.touched && staffCodeField?.invalid">
                {{ staffCodeField?.errors?.['required'] ? 'Mã nhân viên không được để trống' : 'Không vượt quá 50 ký tự' }}
              </span>
            </div>

            <!-- Staff Name -->
            <div>
              <label for="staffName" class="mb-1 block text-sm font-semibold text-slate-700">Tên Nhân Viên <span class="text-red-500">*</span></label>
              <input 
                id="staffName"
                type="text"
                [(ngModel)]="formData.staffName" 
                name="staffName"
                #staffNameField="ngModel"
                required
                maxlength="100"
                autocomplete="name"
                class="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                placeholder="VD: Nguyễn Văn A" />
              <span class="text-red-500 text-xs mt-1 block" *ngIf="staffNameField?.touched && staffNameField?.invalid">
                {{ staffNameField?.errors?.['required'] ? 'Tên nhân viên không được để trống' : 'Không vượt quá 100 ký tự' }}
              </span>
            </div>

            <!-- Staff Type -->
            <div>
              <label for="staffType" class="mb-1 block text-sm font-semibold text-slate-700">Loại Nhân Viên <span class="text-red-500">*</span></label>
              <select
                id="staffType"
                [(ngModel)]="formData.staffType" 
                name="staffType"
                #staffTypeField="ngModel"
                required
                autocomplete="off"
                class="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100"
              >
                <option value="">-- Chọn vai trò --</option>
                <option *ngFor="let role of staffTypeOptions" [ngValue]="role.parValue">{{ role.parName }}</option>
              </select>
              <span class="text-red-500 text-xs mt-1 block" *ngIf="staffTypeField?.touched && staffTypeField?.invalid">
                Loại nhân viên không được để trống
              </span>
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="mb-1 block text-sm font-semibold text-slate-700">Email <span class="text-red-500">*</span></label>
              <input 
                id="email"
                type="email" 
                [(ngModel)]="formData.email" 
                name="email"
                #emailField="ngModel"
                required
                maxlength="50"
                autocomplete="email"
                class="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                placeholder="email@example.com" />
              <span class="text-red-500 text-xs mt-1 block" *ngIf="emailField?.touched && emailField?.invalid">
                {{ emailField?.errors?.['required'] ? 'Email không được để trống' : (emailField?.errors?.['email'] ? 'Email không hợp lệ' : 'Không vượt quá 50 ký tự') }}
              </span>
            </div>

            <!-- ID Number -->
            <div>
              <label for="idNumber" class="mb-1 block text-sm font-semibold text-slate-700">Số CMND/CCCD <span class="text-red-500">*</span></label>
              <input 
                id="idNumber"
                type="text"
                [(ngModel)]="formData.idNumber" 
                name="idNumber"
                #idNumberField="ngModel"
                required
                maxlength="12"
                autocomplete="off"
                class="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                placeholder="VD: 123456789" />
              <span class="text-red-500 text-xs mt-1 block" *ngIf="idNumberField?.touched && idNumberField?.invalid">
                {{ idNumberField?.errors?.['required'] ? 'Số CMND/CCCD không được để trống' : 'Không vượt quá 12 ký tự' }}
              </span>
            </div>

            <!-- Phone Number -->
            <div>
              <label for="phoneNumber" class="mb-1 block text-sm font-semibold text-slate-700">Số Điện Thoại <span class="text-red-500">*</span></label>
              <input 
                id="phoneNumber"
                type="tel"
                [(ngModel)]="formData.phoneNumber" 
                name="phoneNumber"
                #phoneNumberField="ngModel"
                required
                maxlength="10"
                autocomplete="tel-national"
                class="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100" 
                placeholder="0123456789" />
              <span class="text-red-500 text-xs mt-1 block" *ngIf="phoneNumberField?.touched && phoneNumberField?.invalid">
                {{ phoneNumberField?.errors?.['required'] ? 'Số điện thoại không được để trống' : 'Số điện thoại phải đúng 10 chữ số' }}
              </span>
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
              <label for="status" class="mb-1 block text-sm font-semibold text-slate-700">Trạng Thái <span class="text-red-500">*</span></label>
              <input 
                id="status"
                type="text"
                [(ngModel)]="formData.status" 
                name="status"
                #statusField="ngModel"
                required
                maxlength="1"
                autocomplete="off"
                class="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                placeholder="Nhập trạng thái" />
              <span class="text-red-500 text-xs mt-1 block" *ngIf="statusField?.touched && statusField?.invalid">
                Trạng thái không được để trống
              </span>
            </div>

            <!-- Description -->
            <div class="col-span-2">
              <label for="desciption" class="mb-1 block text-sm font-semibold text-slate-700">Mô Tả</label>
              <textarea 
                id="desciption"
                [(ngModel)]="formData.desciption" 
                name="desciption"
                maxlength="2000"
                autocomplete="off"
                class="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                rows="2" 
                placeholder="Nhập mô tả (tùy chọn)"></textarea>
              <div class="text-xs text-slate-500 mt-1">{{ (formData.desciption?.length || 0) }}/2000</div>
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
            type="submit"
            (click)="onSubmit()"
            [disabled]="isSubmitting"
            class="rounded-lg bg-cyan-700 px-4 py-2 font-semibold text-white transition hover:bg-cyan-800 disabled:bg-slate-400 disabled:cursor-not-allowed">
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
  @Input() staffTypeOptions: StaffType[] = [];
  @Output() displayChange = new EventEmitter<boolean>();
  @Output() onSave = new EventEmitter<StaffCreation>();
  @ViewChild('staffForm') staffForm!: NgForm;

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

  errorMessage = '';
  isSubmitting = false;

  constructor(
    private staffService: StaffService,
    private notificationService: NotificationService
  ) {}

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
      this.markFormGroupTouched(this.staffForm);
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

  private markFormGroupTouched(formGroup: NgForm): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.controls[key];
      control?.markAsTouched();
    });
  }
}
