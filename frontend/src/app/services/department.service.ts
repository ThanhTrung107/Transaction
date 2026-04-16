import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DepartmentTree {
  id?: number;
  code: string;
  name: string;
  description?: string;
  parentId?: number | null;
  children?: DepartmentTree[];
}

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private apiUrl = 'http://localhost:8080/departments';

  constructor(private http: HttpClient) {}

  getTree(): Observable<DepartmentTree[]> {
    return this.http.get<DepartmentTree[]>(`${this.apiUrl}/tree`);
  }

  getDepartmentById(id: number): Observable<DepartmentTree> {
    return this.http.get<DepartmentTree>(`${this.apiUrl}/${id}/info`);
  }

  createDepartment(data: DepartmentTree): Observable<DepartmentTree> {
    return this.http.post<DepartmentTree>(this.apiUrl, data);
  }

  updateDepartment(id: number, data: DepartmentTree): Observable<DepartmentTree> {
    return this.http.put<DepartmentTree>(`${this.apiUrl}/${id}`, data);
  }

  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
