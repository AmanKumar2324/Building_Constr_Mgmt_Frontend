import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSubject = new Subject<{ message: string, type: string }>();
  alert$ = this.alertSubject.asObservable();

  constructor() { }

  showAlert(message: string, type: string = 'error') {
    this.alertSubject.next({ message, type });
  }
}
