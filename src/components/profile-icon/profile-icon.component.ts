import { Component, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'profile-icon',
  templateUrl: './profile-icon.component.html',
  styleUrls: ['./profile-icon.component.css']
})
export class ProfileIconComponent {
  profileImageUrl: string;
  userName: string;
  userInitials: string;
  showDropdown = false;
  imageLoadFailed = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.authService.currentUserSubject.subscribe(user => {
      if (user) {
        this.profileImageUrl = user.picture || '';
        this.userName = user.name || user.discord_username || 'User';
        this.userInitials = this.getInitials(this.userName);
        this.imageLoadFailed = false;
      }
    });
  }

  onImageError(): void {
    this.imageLoadFailed = true;
  }

  private getInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showDropdown = false;
    }
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    this.showDropdown = false;
    this.router.navigate(['/']);
  }
}
