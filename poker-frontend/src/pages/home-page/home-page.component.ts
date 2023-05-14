import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {

  url = 'http://147.135.113.14:5000/v1/account/hello';
  name: string | undefined;
  winnings: number | undefined;
  response: Object | undefined;

  form = new FormControl('');

  constructor(private http: HttpClient) { }

  getInfo() {
    this.http.get(this.url).subscribe((res) => {
      this.response = res;
    })
  }

}
