import { Component} from '@angular/core';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Component({
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})


export class HomePageComponent{

  url = 'http://147.135.113.14:5000/v1/account/hello';
  name: string | undefined;
  winnings: number | undefined;
  response: Object | undefined;

  sessionEntry = new FormGroup({
    id: new FormControl(),
    winnings: new FormControl(),
    buy_in_amount: new FormControl(),
    buy_out_amount: new FormControl(),
    location: new FormControl(''),
    date: new FormControl(''),
  });

  constructor(private http: HttpClient) { }


  getInfo() {
    this.http.get(this.url).subscribe((res) => {
      this.response = res;
    })
  }
  onSubmit() {
    const sessionForm = this.sessionEntry.value;
    this.http.post('http://147.135.113.14:5000/v1/session/entry' +
    '?id='+ sessionForm.id +
    '&winnings=' + sessionForm.winnings +
    '&buy_in_amount=' + sessionForm.buy_in_amount +
    '&buy_out_amount=' + sessionForm.buy_out_amount +
    '&location=' + sessionForm.location +
    '&date=' + sessionForm.date , sessionForm)

    .subscribe((res) => {

    });
  }

}
