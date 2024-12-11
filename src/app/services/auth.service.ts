import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:7185/api/auth/login'; // Your backend login endpoint

  constructor(private http: HttpClient) {}
  login(userData: any): Observable<any> {
    return this.http.post('https://localhost:7185/api/auth/login', userData);
  }
}
