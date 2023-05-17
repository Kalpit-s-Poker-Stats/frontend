import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-view-data-page',
  templateUrl: './view-data-page.component.html',
  styleUrls: ['./view-data-page.component.css']
})
export class ViewDataPageComponent {

  url = 'http://147.135.113.14:5000/v1/';
  response: any;

  constructor(private http: HttpClient) { }

  getInfo() {
    this.http.get(this.url).subscribe((res) => {
      this.response = res;
    })
  }

}
