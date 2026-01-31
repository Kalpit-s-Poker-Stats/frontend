import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  public _isAuthenticated$ = new BehaviorSubject<boolean>(false);
  public isAuthenticated$: Observable<boolean> = this._isAuthenticated$.asObservable();

  private readonly DISCORD_AUTH_URL = 'https://discord.com/api/oauth2/authorize';
  private readonly DISCORD_API_URL = 'https://discord.com/api/v10';

  constructor(private http: HttpClient) {
    // Restore user from localStorage on init
    const user = this.getUserFromLocalStorage();
    if (user) {
      this.currentUserSubject.next(user);
      this._isAuthenticated$.next(true);
    }
  }

  private getUserFromLocalStorage(): User | null {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }

  signInWithDiscord(): void {
    const params = new URLSearchParams({
      client_id: environment.discord.clientId,
      redirect_uri: environment.discord.redirectUri,
      response_type: 'code',
      scope: 'identify'
    });

    window.location.href = `${this.DISCORD_AUTH_URL}?${params.toString()}`;
  }

  async handleDiscordCallback(code: string): Promise<boolean> {
    try {
      // Send code to backend to exchange for token and get user info
      const response = await this.http.post<{user: User}>(`${environment.apiUrl}auth/discord`, { code }).toPromise();

      if (response?.user) {
        this.setCurrentUser(response.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error during Discord auth callback:', error);
      return false;
    }
  }

  setCurrentUser(user: User) {
    this.currentUserSubject.next(user);
    this._isAuthenticated$.next(true);
    localStorage.setItem('user', JSON.stringify(user));
  }

  async logout(): Promise<void> {
    this.currentUserSubject.next(null);
    this._isAuthenticated$.next(false);

    // Clear all auth-related localStorage items
    localStorage.removeItem('user');
    localStorage.removeItem('sessionToken');

    // Clear any remaining auth data
    sessionStorage.clear();
  }
}
