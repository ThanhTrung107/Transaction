import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Detail } from './detail.service';

export interface Bill {
  id: number;
  customer_phone: string;
  total: number;
  status: number;
  createdAt?: string;
  created_at?: string;
  details?: Detail[];
}

export interface DetailCreationRequest {
  id?: number;
  card_type?: number;
  value?: number;
  quantity?: number;
  sub_total?: number;
}

export interface TransactionCreatePayload {
  customer_phone: string;
  status: number;
  details: DetailCreationRequest[];
  total: number;  // ← Add total field
}

export interface UpdateTransactionFullRequest {
  customer_phone: string;
  status: number;
  total: number;
  details: DetailCreationRequest[];
  detailsToDelete: number[];  
}
@Injectable({
  providedIn: 'root'
})
export class BillService {
  private apiUrl = 'http://localhost:8080/transactions';

  constructor(private http: HttpClient) { }

  getTransactions(): Observable<Bill[]> {
    return this.http.get<Bill[]>(this.apiUrl);
  }

  getTransaction(id: number): Observable<Bill> {
    return this.http.get<Bill>(`${this.apiUrl}/${id}`);
  }

  createTransaction(transaction: TransactionCreatePayload): Observable<Bill> {
    return this.http.post<Bill>(this.apiUrl, transaction);
  }

  updateTransaction(id: number, transaction: TransactionCreatePayload): Observable<Bill> {
    return this.http.put<Bill>(`${this.apiUrl}/${id}`, transaction);
  }

  updateTransactionFull(id: number, request: UpdateTransactionFullRequest): Observable<Bill> {
    return this.http.put<Bill>(`${this.apiUrl}/${id}/full`, request);
  }

  deleteTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}