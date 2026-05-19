import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-confirm-delete-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  templateUrl: './confirm-delete.component.html',
  styleUrl: './confirm-delete.component.css'
})
export class ConfirmDeleteDialogComponent {
  @Input() display = false;
  @Input() message = 'Bạn có chắc chắn muốn xóa?';
  @Input() isDeleting = false;
  @Input() errorMessage = '';
  @Output() displayChange = new EventEmitter<boolean>();
  @Output() onConfirmed = new EventEmitter<void>();

  onConfirm(): void {
    this.errorMessage = '';
    this.onConfirmed.emit();
  }

  onCancel(): void {
    this.errorMessage = '';
    this.displayChange.emit(false);
  }
}
