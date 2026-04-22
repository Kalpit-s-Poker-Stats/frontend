import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StatsResponse } from '../models/stats.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  constructor(private http: HttpClient) {}

  getStats(pnId: string, begDate?: string, endDate?: string): Observable<StatsResponse> {
    let params = new HttpParams().set('pn_id', pnId);
    if (begDate) params = params.set('beg_date', begDate);
    if (endDate) params = params.set('end_date', endDate);
    return this.http.get<StatsResponse>(`${environment.apiUrl}session/stats`, { params });
  }
}
