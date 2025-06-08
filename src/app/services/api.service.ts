import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { login, User } from '../interfaces/user.interface';
import { AuthResponse } from '../interfaces/auth-response.interface';



@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // ✅ Le backend attend une version dans l’URL (v1 ici)
  private baseUrl = 'https://localhost:44328/api/v1';

  constructor(private http: HttpClient) {}

  /** Authentification **/

  // ✅ POST /api/v1/auth/register
  register(user: Partial<User>): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`, user);
  }

  // ✅ POST /api/v1/auth/authenticate
  authenticate(credentials: login): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/authenticate`, credentials);
  }

  /** Analyse de documents **/

  // ✅ POST /api/v1/document/raw-analyze
  rawAnalyze(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/document/rawaanalyze`, formData);
  }

  // ✅ POST /api/v1/document/analyze
  uploadAndAnalyze(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/document/analyze`, formData);
  }

  // ✅ POST /api/v1/document/analyze/filtered
  getFilteredData(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/document/analyze/filtered`, formData);
  }

  /** Gestion utilisateurs (si exposée côté backend) **/

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users`);
  }

  lockUser(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/${id}/lock`, {});
  }

  unlockUser(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/${id}/unlock`, {});
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/users/${id}`);
  }

  /** Feedback (optionnel, à adapter si exposé) **/
  submitFeedback(feedback: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/feedback`, feedback);
  }
}
