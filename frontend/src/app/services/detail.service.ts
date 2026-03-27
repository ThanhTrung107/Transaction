import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Detail {
  id?: number;
  transaction_id?: number;
  card_type?: number;
  value?: number;
  quantity?: number;
  sub_total?: number;
}
@Injectable({
  providedIn: 'root'
})
export class DetailService {
  private apiUrl = 'http://localhost:8080/detail';

  constructor(private http: HttpClient) { }

  getDetail(id: number): Observable<Detail> {
    return this.http.get<Detail>(`${this.apiUrl}/${id}`);
  }

  createDetail(transactionId: number, detail: Detail): Observable<Detail> {
    return this.http.post<Detail>(`${this.apiUrl}/${transactionId}`, detail);
  }

  updateDetail(id: number, detail: Detail): Observable<Detail> {
    return this.http.put<Detail>(`${this.apiUrl}/${id}`, detail);
  }

  deleteDetail(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}