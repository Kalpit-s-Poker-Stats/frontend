import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLoading = false;
  error: string | null = null;

  constructor(private authService: AuthService) {}

  signInWithDiscord(): void {
    this.isLoading = true;
    this.error = null;
    this.authService.signInWithDiscord();
  }
}
