import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-discord-callback',
  templateUrl: './discord-callback.component.html',
  styleUrls: ['./discord-callback.component.css']
})
export class DiscordCallbackComponent implements OnInit {
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.handleCallback();
  }

  private async handleCallback(): Promise<void> {
    const code = this.route.snapshot.queryParamMap.get('code');
    const errorParam = this.route.snapshot.queryParamMap.get('error');

    if (errorParam) {
      this.error = 'Discord authorization was denied or failed.';
      this.isLoading = false;
      return;
    }

    if (!code) {
      this.error = 'No authorization code received from Discord.';
      this.isLoading = false;
      return;
    }

    try {
      const success = await this.authService.handleDiscordCallback(code);
      if (success) {
        this.router.navigate(['/']);
      } else {
        this.error = 'Failed to complete sign-in. Please try again.';
        this.isLoading = false;
      }
    } catch (error) {
      console.error('Discord callback error:', error);
      this.error = 'An error occurred during sign-in.';
      this.isLoading = false;
    }
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
