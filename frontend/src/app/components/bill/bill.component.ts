import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BillService, TransactionCreatePayload, DetailCreationRequest, UpdateTransactionFullRequest } from '../../services/bill.service';
import { Detail } from '../../services/detail.service';
import { NotificationService } from '../../services/notification.service';

export interface Transaction {
  id: number;
  customer_phone: string;
  total: number;
  status: number;
  createdAt: Date;
  details: Detail[];
}

@Component({
  selector: 'app-bill',
  imports: [CommonModule, FormsModule],
  templateUrl: './bill.component.html',
  styleUrl: './bill.component.css'
})
export class BillComponent implements OnInit {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  searchTerm = '';
  isAdmin = false;

  dialogVisible = false;
  viewDialogVisible = false;
  confirmDeleteDialogVisible = false;
  deleteConfirmationId: number | null = null;
  isEditing = false;
  currentTransaction: Partial<Transaction> = {};
  selectedTransaction: Transaction | null = null;

  // Detail management trong dialog
  tempDetails: Detail[] = []; // Details tạm thời khi thêm/sửa
  currentDetail: Partial<Detail> = {};
  isEditingDetail = false;
  isDetailDialogVisible = false;
  editingDetailIndex: number = -1;

  constructor(
    private authService: AuthService,
    private router: Router,
    private billService: BillService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.isAdmin = this.authService.getRole() === 'admin';
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.billService.getTransactions().subscribe(data => {
      this.transactions = data.map(item => ({
        id: item.id,
        customer_phone: item.customer_phone,
        total: item.total,
        status: item.status,
        createdAt: new Date(item.createdAt ?? item.created_at ?? new Date()),
        details: item.details || []
      }));
      this.filteredTransactions = [...this.transactions];
    });
  }

  filterTransactions(): void {
    if (!this.searchTerm) {
      this.filteredTransactions = [...this.transactions];
    } else {
      this.filteredTransactions = this.transactions.filter(t =>
        t.customer_phone.includes(this.searchTerm)
      );
    }
  }

  getStatusText(status: number): string {
    switch (status) {
      case 1: return 'Chờ xử lý';
      case 2: return 'Thành công';
      case 3: return 'Thất bại';
      default: return 'Không xác định';
    }
  }

  getStatusClass(status: number): string {
    const baseClass = 'px-2 py-1 text-xs font-medium rounded-full ';
    switch (status) {
      case 1: return baseClass + 'bg-yellow-100 text-yellow-800';
      case 2: return baseClass + 'bg-green-100 text-green-800';
      case 3: return baseClass + 'bg-red-100 text-red-800';
      default: return baseClass + 'bg-gray-100 text-gray-800';
    }
  }

  openAddDialog(): void {
    this.isEditing = false;
    this.currentTransaction = {
      customer_phone: '',
      total: 0,
      status: 1,
      details: []
    };
    this.tempDetails = [];
    this.initializeDetailForm();  
    this.dialogVisible = true;
  }

  viewTransaction(transaction: Transaction): void {
    this.selectedTransaction = transaction;
    this.viewDialogVisible = true;
  }

  closeViewDialog(): void {
    this.viewDialogVisible = false;
    this.selectedTransaction = null;
  }

  editTransaction(transaction: Transaction): void {
    this.isEditing = true;
    this.currentTransaction = { ...transaction };
    this.tempDetails = transaction.details ? [...transaction.details] : [];
    this.dialogVisible = true;
  }

  closeDialog(): void {
    this.dialogVisible = false;
    this.currentTransaction = {};
    this.tempDetails = [];
    this.isDetailDialogVisible = false;
    this.currentDetail = {};
    this.editingDetailIndex = -1;
  }

  saveTransaction(): void {
    if (!this.currentTransaction.customer_phone) {
      this.notificationService.showWarning('Vui lòng nhập số điện thoại khách hàng');
      return;
    }
    if (this.currentTransaction.customer_phone.length < 10) {
      this.notificationService.showWarning('Số điện thoại khách hàng phải có ít nhất 10 ký tự');
      return;
    }
    if (this.tempDetails.length === 0) {
      this.notificationService.showWarning('Giao dịch phải có ít nhất 1 chi tiết hàng hóa');
      return;
    }

    const detailsPayload = this.mapDetailsPayload();  // ← Helper tách payload
    const totalAmount = this.getTempDetailsTotal();

    if (this.isEditing && this.currentTransaction.id) {
      // Nếu sửa: update transaction
      const updatePayload: TransactionCreatePayload = {
        customer_phone: this.currentTransaction.customer_phone,
        status: this.currentTransaction.status || 1,
        total: totalAmount,
        details: detailsPayload,
      };

      this.billService.updateTransaction(
        this.currentTransaction.id,
        updatePayload
      ).subscribe(
        () => this.onTransactionSaveSuccess(),
        (error) => this.notificationService.showError('Lỗi cập nhật giao dịch: ' + error.message)
      );
    } else {
      // Nếu thêm mới: create transaction
      const createPayload: TransactionCreatePayload = {
        customer_phone: this.currentTransaction.customer_phone,
        status: this.currentTransaction.status || 1,
        details: detailsPayload,
        total: totalAmount
      };

      this.billService.createTransaction(createPayload).subscribe(
        () => this.onTransactionSaveSuccess(),
        (error) => this.notificationService.showError('Lỗi thêm giao dịch: ' + error.message)
      );
    }
  }



  private onTransactionSaveSuccess(): void {
    const message = this.isEditing ? 'Cập nhật giao dịch thành công' : 'Thêm giao dịch thành công';
    this.notificationService.showSuccess(message);
    this.loadTransactions();
    this.closeDialog();
  }

  deleteTransaction(id: number): void {
    this.deleteConfirmationId = id;
    this.confirmDeleteDialogVisible = true;
  }

  confirmDelete(): void {
    if (this.deleteConfirmationId !== null) {
      this.billService.deleteTransaction(this.deleteConfirmationId).subscribe(
        () => {
          this.notificationService.showSuccess('Xóa giao dịch thành công');
          this.loadTransactions();
          this.closeConfirmDeleteDialog();
        },
        (error) => {
          this.notificationService.showError('Lỗi xóa giao dịch: ' + error.message);
          this.closeConfirmDeleteDialog();
        }
      );
    }
  }

  closeConfirmDeleteDialog(): void {
    this.confirmDeleteDialogVisible = false;
    this.deleteConfirmationId = null;
  }

  // Detail management trong dialog giao dịch
  openDetailDialogInTransaction(detail?: Detail, index?: number): void {
    this.initializeDetailForm(detail);
    if (detail && index !== undefined) {
      this.editingDetailIndex = index;
    }
  }

  // Helper: Init/reset detail form
  private initializeDetailForm(detail?: Detail): void {
    this.isEditingDetail = !!detail;
    this.editingDetailIndex = -1;

    if (detail) {
      this.currentDetail = { ...detail };
    } else {
      this.currentDetail = {
        card_type: 1,
        value: 0,
        quantity: 1,
        sub_total: 0
      };
    }
    this.isDetailDialogVisible = true;
  }

  closeDetailDialog(): void {
    this.isDetailDialogVisible = false;
    this.currentDetail = {};
    this.isEditingDetail = false;
    this.editingDetailIndex = -1;
  }

  // Helper: Calculate sub_total từ value và quantity
  private calculateDetailSubTotal(value: number | undefined, quantity: number | undefined): number {
    return (value || 0) * (quantity || 0);
  }

  calculateSubTotal(): void {
    if (this.currentDetail.value && this.currentDetail.quantity) {
      this.currentDetail.sub_total = this.calculateDetailSubTotal(
        this.currentDetail.value,
        this.currentDetail.quantity
      );
    }
  }

  getTempDetailsTotal(): number {
    return this.tempDetails.reduce((sum, d) => sum + (d.sub_total || 0), 0);
  }

  // Helper: Map details to payload
  private mapDetailsPayload(): DetailCreationRequest[] {
    return this.tempDetails.map(d => ({
      id: d.id,
      card_type: d.card_type,
      value: d.value,
      quantity: d.quantity,
      sub_total: d.sub_total
    }));
  }

  // Helper: Find duplicate detail by card_type + value
  private findDuplicateDetail(excludeIndex?: number): number {
    return this.tempDetails.findIndex((d, idx) => {
      if (excludeIndex !== undefined && idx === excludeIndex) return false;
      return d.card_type === this.currentDetail.card_type &&
             d.value === this.currentDetail.value;
    });
  }

  // Helper: Validate detail fields
  private validateDetailFields(): boolean {
    if (this.currentDetail.card_type === undefined || this.currentDetail.card_type === null ||
        this.currentDetail.value === undefined || this.currentDetail.value === null ||
        this.currentDetail.quantity === undefined || this.currentDetail.quantity === null) {
      this.notificationService.showWarning('Vui lòng nhập đầy đủ thông tin detail');
      return false;
    }
    if (this.currentDetail.value <= 0) {
      this.notificationService.showWarning('Giá trị phải lớn hơn 0');
      return false;
    }
    return true;
  }

  saveDetailInTransaction(): void {
    if (!this.validateDetailFields()) return;
    
    this.calculateSubTotal();

    if (this.isEditingDetail && this.editingDetailIndex >= 0) {
      // Sửa detail: kiểm tra có trở thành duplicate với detail khác không
      const duplicateIndex = this.findDuplicateDetail(this.editingDetailIndex);

      if (duplicateIndex !== -1) {
        // Có duplicate → merge vào duplicate, xóa current
        this.tempDetails[duplicateIndex].quantity =
          (this.tempDetails[duplicateIndex].quantity || 0) +
          (this.currentDetail.quantity || 1);
        this.tempDetails[duplicateIndex].sub_total = this.calculateDetailSubTotal(
          this.tempDetails[duplicateIndex].value,
          this.tempDetails[duplicateIndex].quantity
        );

        // Nếu detail đang EDIT có ID (từ database), mark để xóa
        const editingDetail = this.tempDetails[this.editingDetailIndex];
       
        // Xóa current detail từ tempDetails
        this.tempDetails.splice(this.editingDetailIndex, 1);

        this.notificationService.showSuccess('Cập nhật số lượng chi tiết thành công (merged)');
      } else {
        // Không duplicate → cập nhật detail hiện tại
        this.tempDetails[this.editingDetailIndex] = { ...this.currentDetail } as Detail;
        this.notificationService.showSuccess('Cập nhật chi tiết thành công');
      }
      this.closeDetailDialog();
    } else {
      // Thêm detail mới: kiểm tra duplicate trước khi lưu
      const duplicateIndex = this.findDuplicateDetail();

      if (duplicateIndex !== -1) {
        // Đã tồn tại -> tăng số lượng
        this.tempDetails[duplicateIndex].quantity = (this.tempDetails[duplicateIndex].quantity || 0) + (this.currentDetail.quantity || 1);
        this.tempDetails[duplicateIndex].sub_total = this.calculateDetailSubTotal(
          this.tempDetails[duplicateIndex].value,
          this.tempDetails[duplicateIndex].quantity
        );
        this.notificationService.showSuccess('Cập nhật số lượng chi tiết thành công');
        this.closeDetailDialog();
      } else {
        // Chưa tồn tại -> lưu local (không call API, chờ click cập nhật)
        this.tempDetails.push({ ...this.currentDetail } as Detail);
        this.notificationService.showSuccess('Thêm chi tiết thành công');
        this.closeDetailDialog();
      }
    }
  }

  deleteDetailInTransaction(index: number): void {
    const detail = this.tempDetails[index];
    const cardTypeLabel = this.getCardTypeLabel(detail.card_type);

    // Hiển thị confirmation
    const confirmDelete = confirm(`Xóa chi tiết ${cardTypeLabel} ${detail.value} VND?\n(Hành động này sẽ xóa khi click cập nhật)`);

    if (!confirmDelete) {
      return;
    }

    // Xóa từ danh sách local
    this.tempDetails.splice(index, 1);
    this.notificationService.showSuccess('Xóa chi tiết thành công');
  }

  getCardTypeLabel(cardType?: number): string {
    switch (cardType) {
      case 1: return 'Viettel';
      case 2: return 'Vinaphone';
      default: return 'Không xác định';
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
