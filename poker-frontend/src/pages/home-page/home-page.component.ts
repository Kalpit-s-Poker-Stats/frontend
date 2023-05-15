import { Component, OnInit } from '@angular/core';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Component({
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})

@Injectable()
export class ConfigService {
  constructor(private http: HttpClient) { }
}

export class HomePageComponent implements OnInit{

  url = 'http://147.135.113.14:5000/v1/account/hello';
  name: string | undefined;
  winnings: number | undefined;
  response: Object | undefined;

  form = new FormControl('');

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    let headers = ({});
    this.http.get<any>('(Enter API URL HERE', { 
      headers: headers 
    }).subscribe(data=> {
      console.log(data)
    });
  }

  getInfo() {
    this.http.get(this.url).subscribe((res) => {
      this.response = res;
    })
  }

}
