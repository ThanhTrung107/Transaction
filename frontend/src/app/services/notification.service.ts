import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();
  private notificationCounter = 0;

  constructor() { }

  showSuccess(message: string, duration: number = 3000): void {
    this.show({ type: 'success', message, duration });
  }

  showError(message: string, duration: number = 4000): void {
    this.show({ type: 'error', message, duration });
  }

  showWarning(message: string, duration: number = 3500): void {
    this.show({ type: 'warning', message, duration });
  }

  showInfo(message: string, duration: number = 3000): void {
    this.show({ type: 'info', message, duration });
  }

  private show(notification: Omit<Notification, 'id'>): void {
    const id = `notification-${this.notificationCounter++}`;
    const notif: Notification = { ...notification, id };
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, notif]);

    if (notification.duration && notification.duration > 0) {
      setTimeout(() => this.remove(id), notification.duration);
    }
  }

  remove(id: string): void {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next(currentNotifications.filter(n => n.id !== id));
  }

  clear(): void {
    this.notificationsSubject.next([]);
  }
}
