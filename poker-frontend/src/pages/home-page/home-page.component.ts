import { Component} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})


export class HomePageComponent{

  constructor(private router: Router) { }

  navigateUser(page: string) {
    this.router.navigate([page]);
  }

}
