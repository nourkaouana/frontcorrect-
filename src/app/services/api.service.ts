import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

import { RegistrationRequest, AuthRequest, User } from '../interfaces/user.interface';
import { AuthResponse } from '../interfaces/auth-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  /** Authentication **/

  // POST /api/auth/register
  register(user: RegistrationRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`, user);
  }

  // POST /api/auth/authenticate
  authenticate(credentials: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/authenticate`, credentials);
  }

  /** Document Analysis **/

  // POST /api/document/RawaAnalyze
  rawAnalyze(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/document/RawaAnalyze`, formData);
  }

  // POST /api/document/analyze
  uploadAndAnalyze(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/document/analyze`, formData);
  }

  // POST /api/document/analyze/filtered
  getFilteredData(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/document/analyze/filtered`, formData);
  }

  /** User Management **/

  // GET /api/users/all
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users/all`);
  }

  // GET /api/users/{id}
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${id}`);
  }

  // GET /api/users/email/{email}
  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/email/${email}`);
  }

  // GET /api/users/username/{username}
  getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/username/${username}`);
  }

  // PUT /api/users/update-password
  updatePassword(data: { email: string; newpassword: string; username: string }): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/update-password`, data);
  }

  // DELETE /api/users/{id}
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/users/${id}`);
  }

  // POST /api/users/lock/{id}
  lockUser(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/lock/${id}`, {});
  }

  // POST /api/users/unlock/{id}
  unlockUser(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/unlock/${id}`, {});
  }

  /** Feedback **/
  submitFeedback(feedback: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/feedback`, feedback);
  }
}
