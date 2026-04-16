import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DepartmentTree, DepartmentService } from '../../services/department.service';

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
  styles: `
    ::ng-deep .p-dialog-mask {
      background: radial-gradient(circle at center, rgba(30, 41, 59, 0.45), rgba(2, 6, 23, 0.82));
    }
    ::ng-deep .p-dialog {
      background: #f8fafc;
      box-shadow: 0 24px 70px rgba(15, 23, 42, 0.35);
      border-radius: 16px;
      overflow: hidden;
    }
    ::ng-deep .p-dialog .p-dialog-header {
      background: linear-gradient(135deg, #1d4ed8, #2563eb);
      border-bottom: 0;
      padding: 1rem 1.25rem;
    }
    ::ng-deep .p-dialog .p-dialog-title {
      color: #ffffff;
      font-weight: 700;
      font-size: 1.15rem;
    }
    ::ng-deep .p-dialog .p-dialog-header-icons .p-dialog-header-close {
      color: #dbeafe;
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
    <p-dialog [(visible)]="display" [modal]="true" [header]="isEdit ? 'Cập nhật Phòng Ban' : 'Tạo Phòng Ban'" 
              [style]="{ width: '620px', maxWidth: '95vw' }" [showHeader]="true" (onHide)="onHide()">
      <div class="space-y-4 pb-4">
        <div class="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
          <span class="font-semibold">Lưu ý:</span> Bạn có thể chọn phòng ban cha để tạo cấu trúc phân cấp.
        </div>

        <form (ngSubmit)="onSubmit()" class="space-y-4" autocomplete="on">
          <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
          <!-- Code -->
          <div>
            <label for="departmentCode" class="mb-1 block text-sm font-semibold text-slate-700">Mã Phòng Ban</label>
            <input 
              id="departmentCode"
              type="text"
              [(ngModel)]="formData.code" 
              name="code" 
              autocomplete="off"
              class="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              placeholder="VD: SALES" />
            <span class="text-red-500 text-xs mt-1 block" *ngIf="errors['code']">{{ errors['code'] }}</span>
          </div>

          <!-- Name -->
          <div>
            <label for="departmentName" class="mb-1 block text-sm font-semibold text-slate-700">Tên Phòng Ban</label>
            <input 
              id="departmentName"
              type="text"
              [(ngModel)]="formData.name" 
              name="name" 
              autocomplete="organization"
              class="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              placeholder="VD: Phòng Bán Hàng" />
            <span class="text-red-500 text-xs mt-1 block" *ngIf="errors['name']">{{ errors['name'] }}</span>
          </div>

          <!-- Parent Department -->
          <div>
            <label for="parentDepartment" class="mb-1 block text-sm font-semibold text-slate-700">Phòng Ban Cha</label>
            <select 
              id="parentDepartment"
              [(ngModel)]="formData.parentId" 
              name="parentId"
              autocomplete="off"
              class="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100">
              <option [ngValue]="null">-- Chọn phòng ban cha (tùy chọn) --</option>
              <option *ngFor="let dept of parentDepartments" [ngValue]="dept.id">{{ dept.name }}</option>
            </select>
            <span class="text-red-500 text-xs mt-1 block" *ngIf="errors['parentId']">{{ errors['parentId'] }}</span>
          </div>

          <!-- Description -->
          <div>
            <label for="departmentDescription" class="mb-1 block text-sm font-semibold text-slate-700">Mô Tả</label>
            <textarea 
              id="departmentDescription"
              [(ngModel)]="formData.description" 
              name="description"
              autocomplete="off"
              class="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              rows="3" 
              placeholder="Nhập mô tả (tùy chọn)"></textarea>
          </div>
          </div>

          <!-- Error Message -->
          <div class="rounded-lg bg-red-50 p-3 text-sm text-red-600" *ngIf="errorMessage">
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
            class="rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white transition hover:bg-blue-800"
            (click)="onSubmit()">
            {{ isEdit ? 'Cập nhật' : 'Tạo mới' }}
          </button>
        </div>
      </ng-template>
    </p-dialog>
  `
})
export class DepartmentDialogComponent implements OnChanges {
  @Input() display = false;
  @Input() isEdit = false;
  @Input() parentDepartments: DepartmentTree[] = [];
  @Input() selectedDepartmentId: number | null = null;
  @Output() displayChange = new EventEmitter<boolean>();
  @Output() onSave = new EventEmitter<DepartmentTree>();

  formData: DepartmentTree = {
    code: '',
    name: '',
    description: '',
    parentId: null
  };

  errors: { [key: string]: string } = {};
  errorMessage = '';
  isSubmitting = false;

  constructor(private departmentService: DepartmentService) {}

  ngOnChanges(changes: SimpleChanges): void {
    const displayChange = changes['display'];
    const dialogJustOpened = displayChange?.currentValue === true
      && (displayChange?.previousValue === false || displayChange?.firstChange);

    if (!dialogJustOpened) {
      return;
    }

    if (this.isEdit && this.selectedDepartmentId) {
      console.log('Loading department data for ID:', this.selectedDepartmentId);
      this.departmentService.getDepartmentById(this.selectedDepartmentId).subscribe({
        next: (data) => {
          console.log('Department data loaded successfully:', data);
          this.formData = { ...data };
        },
        error: (error) => {
          console.error('Error loading department:', error);
          this.errorMessage = 'Không thể tải dữ liệu phòng ban: ' + (error?.error?.message || error?.message || 'Unknown error');
        }
      });
    } else if (!this.isEdit) {
      this.resetForm();
    }
  }

  onSubmit(): void {
    if (!this.validate()) {
      return;
    }

    this.isSubmitting = true;
    const request = this.isEdit
      ? this.departmentService.updateDepartment(this.selectedDepartmentId!, this.formData)
      : this.departmentService.createDepartment(this.formData);

    request.subscribe({
      next: (result) => {
        this.isSubmitting = false;
        this.onSave.emit(result);
        this.displayChange.emit(false);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error?.error?.message || 'Có lỗi xảy ra';
        console.error('Error:', error);
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

    if (!this.formData.code || this.formData.code.trim() === '') {
      this.errors['code'] = 'Mã phòng ban không được để trống';
    } else if (this.formData.code.length > 50) {
      this.errors['code'] = 'Mã phòng ban không được vượt quá 50 ký tự';
    }

    if (!this.formData.name || this.formData.name.trim() === '') {
      this.errors['name'] = 'Tên phòng ban không được để trống';
    } else if (this.formData.name.length > 100) {
      this.errors['name'] = 'Tên phòng ban không được vượt quá 100 ký tự';
    }

    if (this.formData.description && this.formData.description.length > 2000) {
      this.errors['description'] = 'Mô tả không được vượt quá 2000 ký tự';
    }

    return Object.keys(this.errors).length === 0;
  }

  private resetForm(): void {
    this.formData = {
      code: '',
      name: '',
      description: '',
      parentId: null
    };
    this.errors = {};
    this.errorMessage = '';
  }
}
