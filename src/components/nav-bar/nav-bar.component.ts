import { Component } from '@angular/core';
import { skipWhile } from 'rxjs';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {

  isLoggedIn: boolean;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService._isAuthenticated$
      .pipe(skipWhile((value: boolean) => value === undefined))
      .subscribe((value: boolean ) => {
        this.isLoggedIn = value;
    })
  }
}
