import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StaffType {
  parValue: string;
  parName: string;
}

export interface StaffCreation {
  id?: number;
  staffId?: number;
  staffCode: string;
  staffName: string;
  staffType: string;
  staffTypeName?: string;
  depId: number;
  email: string;
  idNumber: string;
  phoneNumber: string;
  desciption?: string;
  status: string;
  address?: string;
  birthDay?: string | Date;
}

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  private apiUrl = 'http://localhost:8080/staff';

  constructor(private http: HttpClient) {}

  getStaffTypes(): Observable<StaffType[]> {
    return this.http.get<StaffType[]>(`${this.apiUrl}/position`);
  }

  getStaffByDepartment(depId: number): Observable<StaffCreation[]> {
    return this.http.get<StaffCreation[]>(`http://localhost:8080/departments/${depId}/staffs`);
  }

  getStaffById(staffId: number): Observable<StaffCreation> {
    return this.http.get<StaffCreation>(`${this.apiUrl}/${staffId}/info`);
  }

  saveStaff(data: StaffCreation): Observable<StaffCreation> {
    return this.http.post<StaffCreation>(`${this.apiUrl}/save`, data);
  }

  deleteStaff(staffId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${staffId}`);
  }
}
