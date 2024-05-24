// splitwise.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SplitwiseService {
  private apiUrl = 'https://secure.splitwise.com/api/v3.0';

  constructor(private http: HttpClient) { }

  //FUNCTION DOES NOT WORK CURRENTLY
  authenticate(clientId: string, clientSecret: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials'
    };

    return this.http.post<any>('https://cors-anywhere.herokuapp.com/https://secure.splitwise.com/oauth/token', body, { headers });
  }

  createExpense(token: string, expenseData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Access-Control-Allow-Origin': 'localhost:4200'
    });

    return this.http.post<any>('https://secure.splitwise.com/api/v3.0/create_expense', expenseData, { headers });
  }
}
