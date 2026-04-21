import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { Subscription } from 'rxjs';
import { User } from 'src/models/user.model';
import { POKER_FACTS } from 'src/constants/poker-facts';

@Component({
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  currentUser: User | null = null;
  pokerFact = '';

  private authSubscription: Subscription | null = null;
  private userSubscription: Subscription | null = null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.isAuthenticated$.subscribe(
      (isAuth: boolean) => {
        this.isLoggedIn = isAuth;
      }
    );

    this.userSubscription = this.authService.currentUser$.subscribe(
      (user: User | null) => {
        this.currentUser = user;
        if (user) {
          this.pokerFact = this.getRandomPokerFact();
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
    this.userSubscription?.unsubscribe();
  }

  navigateUser(page: string): void {
    this.router.navigate([page]);
  }

  getFirstName(): string {
    if (this.currentUser?.name) {
      return this.currentUser.name.split(' ')[0];
    }
    return 'Player';
  }

  private getRandomPokerFact(): string {
    const randomIndex = Math.floor(Math.random() * POKER_FACTS.length);
    return POKER_FACTS[randomIndex];
  }
}
