import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-confirm-delete-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  styles: `
    ::ng-deep .p-dialog-mask {
      background: radial-gradient(circle at center, rgba(127, 29, 29, 0.35), rgba(15, 23, 42, 0.85));
    }
    ::ng-deep .p-dialog {
      background: #fff7f7;
      box-shadow: 0 24px 70px rgba(127, 29, 29, 0.32);
      border-radius: 16px;
      overflow: hidden;
    }
    ::ng-deep .p-dialog .p-dialog-header {
      background: linear-gradient(135deg, #b91c1c, #dc2626);
      border-bottom: 0;
      padding: 1rem 1.25rem;
    }
    ::ng-deep .p-dialog .p-dialog-title {
      color: #ffffff;
      font-weight: 700;
      font-size: 1.15rem;
    }
    ::ng-deep .p-dialog .p-dialog-header-icons .p-dialog-header-close {
      color: #fee2e2;
    }
    ::ng-deep .p-dialog .p-dialog-content {
      padding: 1.25rem;
      background: #fff7f7;
    }
    ::ng-deep .p-dialog .p-dialog-footer {
      background: #fff7f7;
      padding: 0 1.25rem 1.25rem;
    }
  `,
  template: `
    <p-dialog [(visible)]="display" [modal]="true" header="Xác Nhận Xóa" 
              [style]="{ width: '460px', maxWidth: '95vw' }" [showHeader]="true" (onHide)="onCancel()">
      <div class="rounded-xl border border-red-200 bg-white p-4 shadow-sm">
        <div class="mb-3 inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
          <i class="pi pi-exclamation-triangle"></i>
          Hành động nguy hiểm
        </div>

        <div class="flex items-start gap-4">
          <i class="pi pi-trash text-red-600 text-3xl shrink-0 mt-1"></i>
        <div class="flex-1">
          <p class="mb-2 font-semibold text-slate-900">{{ message }}</p>
          <p class="text-sm text-slate-600">Sau khi xác nhận, dữ liệu sẽ bị xóa vĩnh viễn và không thể hoàn tác.</p>
          </div>
        </div>
      </div>

      <ng-template pTemplate="footer">
        <div class="flex justify-end gap-3 border-t border-red-100 pt-4">
          <button 
            class="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-50"
            (click)="onCancel()">
            Hủy
          </button>
          <button 
            class="rounded-lg bg-red-700 px-4 py-2 font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-70"
            [disabled]="isDeleting"
            (click)="onConfirm()">
            {{ isDeleting ? 'Đang xóa...' : 'Xóa' }}
          </button>
        </div>
      </ng-template>
    </p-dialog>
  `
})
export class ConfirmDeleteDialogComponent {
  @Input() display = false;
  @Input() message = 'Bạn có chắc chắn muốn xóa?';
  @Input() isDeleting = false;
  @Output() displayChange = new EventEmitter<boolean>();
  @Output() onConfirmed = new EventEmitter<void>();

  onConfirm(): void {
    this.onConfirmed.emit();
  }

  onCancel(): void {
    this.displayChange.emit(false);
  }
}
