import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TreeNode } from 'primeng/api';
import { TreeModule } from 'primeng/tree';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DepartmentService, DepartmentTree } from '../../services/department.service';
import { StaffService, StaffCreation } from '../../services/staff.service';
import { DepartmentDialogComponent } from '../dialogs/department-dialog.component';
import { StaffDialogComponent } from '../dialogs/staff-dialog.component';
import { ConfirmDeleteDialogComponent } from '../dialogs/confirm-delete.component';

interface StaffDetail {
  id?: number;
  staffId?: number;
  staffCode: string;
  staffName: string;
  staffType: string;
  staffTypeName: string;
  depId: number;
  email: string;
  phoneNumber: string;
  address: string;
  birthDay: string | null;
}

interface OrganizationNodeData {
  kind: 'department' | 'staff';
  departmentId?: number;    
  departmentCode?: string;  
  staffId?: number;
  staffTypeName?: string;
  staffsLoaded?: boolean;
}

type OrganizationTreeNode = TreeNode<OrganizationNodeData>;

@Component({
  selector: 'app-tree',
  imports: [
    CommonModule,
    TreeModule,
    ButtonModule,
    TableModule,
    TooltipModule,
    DepartmentDialogComponent,
    StaffDialogComponent,
    ConfirmDeleteDialogComponent
  ],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.css'
})
export class TreeComponent implements OnInit {
  private readonly apiBase = 'http://localhost:8080/departments';

  treeNodes: OrganizationTreeNode[] = [];
  selectedNode: OrganizationTreeNode | null = null;
  loadingTree = false;
  errorMessage = '';
  
  // Staff list display
  selectedDepartmentId: number | null = null;
  selectedDepartmentName = '';
  selectedDepartmentNodeKey: string | null = null;  // Track selected node key for highlighting
  staffList: StaffDetail[] = [];
  loadingStaff = false;
  staffErrorMessage = '';

  // Department Dialog
  showDepartmentDialog = false;
  isEditingDepartment = false;
  editingDepartmentId: number | null = null;  // Track ID của department đang edit
  parentDepartments: DepartmentTree[] = [];

  // Staff Dialog
  showStaffDialog = false;
  isEditingStaff = false;
  selectedStaffId: number | null = null;

  // Delete Confirmation
  showConfirmDelete = false;
  deleteType: 'department' | 'staff' = 'department';
  deleteId: number | null = null;
  deleteMessage = '';
  isDeleting = false;

  constructor(
    private http: HttpClient,
    private departmentService: DepartmentService,
    private staffService: StaffService
  ) {}

  ngOnInit(): void {
    this.loadTree();
  }

  loadTree(): void {
    this.loadingTree = true;
    this.errorMessage = '';

    this.http.get<DepartmentTree[]>(`${this.apiBase}/tree`).subscribe({
      next: (data) => {
        this.treeNodes = (data ?? []).map((department) => this.toDepartmentNode(department));
        this.loadingTree = false;
      },
      error: (error) => {
        this.loadingTree = false;
        this.errorMessage = error?.error?.message || 'Khong tai duoc cay phong ban';
      }
    });
  }

  onNodeExpand(event: { node: OrganizationTreeNode }): void {
    const { node } = event;
    if (node.data?.kind !== 'department' || !node.data.departmentId) {
      return;
    }

    if (node.data.staffsLoaded) {
      return;
    }

    node.loading = true;
    this.http.get<StaffCreation[]>(`${this.apiBase}/${node.data.departmentId}/staffs`).subscribe({
      next: (staffs) => {
        const departmentChildren = (node.children ?? []).filter((child) => child.data?.kind === 'department');
        
        // Chỉ hiển thị phòng ban trong tree, không hiển thị nhân viên
        node.children = [...departmentChildren];
        node.loading = false;
        if (node.data) {
          node.data.staffsLoaded = true;
        }

        this.treeNodes = [...this.treeNodes];
      },
      error: () => {
        node.loading = false;
        if (node.data) {
          node.data.staffsLoaded = true;
        }
      }
    });
  }

  onNodeSelect(node: any): void {
    if (!node || !node.data) {
      this.staffList = [];
      this.selectedDepartmentName = '';
      this.selectedDepartmentId = null;
      this.selectedDepartmentNodeKey = null;
      return;
    }

    // Only load staff if department is selected, not staff
    if (node.data.kind === 'department' && node.data.departmentId) {
      // Track selected department node for highlighting
      this.selectedDepartmentNodeKey = node.key;
      // Kiểm tra nếu node có children (không phải node cuối)
      if (node.children && node.children.length > 0) {
        // Node có con - chỉ hiển thị children, không hiển thị staff
        this.staffList = [];
        this.selectedDepartmentName = '';
        this.selectedDepartmentId = null;
        return;
      }

      // Node cuối (không có children) - hiển thị staff
      this.selectedDepartmentId = node.data.departmentId;
      this.selectedDepartmentName = node.label || '';
      this.loadingStaff = true;
      this.staffErrorMessage = '';

      this.staffService.getStaffByDepartment(node.data.departmentId).subscribe({
        next: (staffs) => {
          this.staffList = (staffs ?? []).map(staff => ({
            ...staff,
            staffId: staff.id ?? staff.staffId,
            staffTypeName: staff.staffTypeName || ''
          } as StaffDetail));
          this.loadingStaff = false;
        },
        error: (error) => {
          this.loadingStaff = false;
          this.staffErrorMessage = error?.error?.message || 'Không tải được danh sách nhân viên';
        }
      });
    } else if (node.data.kind === 'staff') {
      // If staff node is selected, keep showing the department's staff list
      return;
    }
  }

  getStaffTypeClass(staffType: string): string {
    switch (staffType) {
      case '1':
        return 'bg-green-100 text-green-800';
      case '2':
        return 'bg-blue-100 text-blue-800';
      case '3':
        return 'bg-pink-100 text-pink-800';
      case '4':
        return 'bg-yellow-100 text-yellow-800';
      case '5':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  }

  private toDepartmentNode(department: DepartmentTree): OrganizationTreeNode {
    const children = (department.children ?? []).map((child) => this.toDepartmentNode(child));
    return {
      key: `dept-${department.id ?? department.code}`,
      label: department.name,
      data: {
        kind: 'department',
        departmentId: department.id,  
        departmentCode: department.code, 
        staffsLoaded: false
      },
      expandedIcon: 'pi pi-folder-open',
      collapsedIcon: 'pi pi-folder',
      children: children,
      leaf: children.length === 0,  // No expand arrow if no child departments
      selectable: true
    };
  }

  private toStaffNode(staff: StaffDetail): OrganizationTreeNode {
    return {
      key: `staff-${staff.staffId}`,
      label: staff.staffName,
      data: {
        kind: 'staff',
        staffId: staff.staffId,
        staffTypeName: staff.staffTypeName
      },
      icon: 'pi pi-user',
      leaf: true,
      selectable: true
    };
  }

  // DEPARTMENT
  openCreateDepartmentDialog(): void {
    this.isEditingDepartment = false;
    this.editingDepartmentId = null;  // Reset khi tạo mới
    this.showDepartmentDialog = true;
    this.loadAllDepartmentsForParent();
  }

  openEditDepartmentDialog(departmentId: number): void {
    this.isEditingDepartment = true;
    this.editingDepartmentId = departmentId;  // Lưu ID để dialog load dữ liệu
    this.showDepartmentDialog = true;
    this.loadAllDepartmentsForParent();
  }

  onDepartmentSaved(dept: DepartmentTree): void {
    this.loadTree();
  }

  deleteDepartment(departmentId: number, departmentName: string): void {
    this.deleteType = 'department';
    this.deleteId = departmentId;
    this.deleteMessage = `Bạn có chắc chắn muốn xóa phòng ban "${departmentName}"?`;
    this.showConfirmDelete = true;
  }

  onDeleteConfirmed(): void {
    if (!this.deleteId) return;

    this.isDeleting = true;
    if (this.deleteType === 'department') {
      this.departmentService.deleteDepartment(this.deleteId).subscribe({
        next: () => {
          this.isDeleting = false;
          this.showConfirmDelete = false;
          this.loadTree();
        },
        error: (error) => {
          this.isDeleting = false;
          console.error('Error deleting department:', error);
          alert(error?.error?.message || 'Không thể xóa phòng ban');
        }
      });
    } else if (this.deleteType === 'staff') {
      this.staffService.deleteStaff(this.deleteId).subscribe({
        next: () => {
          this.isDeleting = false;
          this.showConfirmDelete = false;
          if (this.selectedDepartmentId) {
            this.loadStaffList(this.selectedDepartmentId);
          }
        },
        error: (error) => {
          this.isDeleting = false;
          console.error('Error deleting staff:', error);
          alert(error?.error?.message || 'Không thể xóa nhân viên');
        }
      });
    }
  }

  private loadAllDepartmentsForParent(): void {
    this.departmentService.getTree().subscribe({
      next: (data) => {
        this.parentDepartments = this.flattenDepartments(data);
      },
      error: () => {
        this.parentDepartments = [];
      }
    });
  }

  private flattenDepartments(departments: DepartmentTree[]): DepartmentTree[] {
    const result: DepartmentTree[] = [];
    const traverse = (depts: DepartmentTree[]) => {
      depts.forEach((dept) => {
        result.push(dept);
        if (dept.children && dept.children.length > 0) {
          traverse(dept.children);
        }
      });
    };
    traverse(departments);
    return result;
  }

  // ====== STAFF ACTIONS ======
  openCreateStaffDialog(): void {
    if (!this.selectedDepartmentId) {
      alert('Vui lòng chọn một phòng ban trước');
      return;
    }
    this.isEditingStaff = false;
    this.selectedStaffId = null;
    this.showStaffDialog = true;
  }

  openEditStaffDialog(staff: StaffDetail): void {
    const resolvedStaffId = this.resolveStaffId(staff);

    if (resolvedStaffId) {
      this.applyEditStaffDialogState(resolvedStaffId);
      return;
    }

    if (!staff.staffCode) {
      return;
    }

    // this.staffService.getStaffByCode(staff.staffCode).subscribe({
    //   next: (data) => {
    //     const fallbackId = this.resolveStaffId(data as StaffDetail);
    //     if (!fallbackId) {
    //       return;
    //     }

    //     this.applyEditStaffDialogState(fallbackId);
    //   },
    //   error: () => {}
    // });
  }

  private applyEditStaffDialogState(staffId: number): void {
    this.isEditingStaff = true;
    this.selectedStaffId = staffId;
    this.showStaffDialog = true;
  }

  private resolveStaffId(staff: Partial<StaffDetail> | null | undefined): number | null {
    if (!staff) {
      return null;
    }

    const rawId = (staff as any).staffId ?? (staff as any).id ?? (staff as any).staffID ?? (staff as any).staff_id;
    const numericId = Number(rawId);
    return Number.isFinite(numericId) && numericId > 0 ? numericId : null;
  }

  onStaffSaved(staff: StaffCreation): void {
    if (this.selectedDepartmentId) {
      this.loadStaffList(this.selectedDepartmentId);
    }
  }

  deleteStaff(staffId: number | null | undefined, staffName: string): void {
    if (!staffId) {
      return;
    }

    this.deleteType = 'staff';
    this.deleteId = staffId;
    this.deleteMessage = `Bạn có chắc chắn muốn xóa nhân viên "${staffName}"?`;
    this.showConfirmDelete = true;
  }

  private loadStaffList(depId: number): void {
    this.selectedDepartmentId = depId;
    this.loadingStaff = true;
    this.staffErrorMessage = '';

    this.staffService.getStaffByDepartment(depId).subscribe({
      next: (staffs) => {
        this.staffList = (staffs ?? []).map(staff => ({
          ...staff,
          staffId: this.resolveStaffId(staff as any) ?? undefined,
          staffTypeName: staff.staffTypeName || ''
        } as StaffDetail));

        this.loadingStaff = false;
      },
      error: (error) => {
        this.loadingStaff = false;
        this.staffErrorMessage = error?.error?.message || 'Không tải được danh sách nhân viên';
      }
    });
  }
}
