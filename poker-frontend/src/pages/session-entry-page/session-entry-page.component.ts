import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-session-entry-page',
  templateUrl: './session-entry-page.component.html',
  styleUrls: ['./session-entry-page.component.css']
})
export class SessionEntryPageComponent {

  url = 'http://147.135.113.14:5000/v1/';
  name: string | undefined;
  winnings: number | undefined;
  response: Object | undefined;
  added: string | undefined;

  sessionEntry = new FormGroup({
    id: new FormControl(),
    winnings: new FormControl(),
    buy_in_amount: new FormControl(),
    buy_out_amount: new FormControl(),
    location: new FormControl(''),
    date: new FormControl(''),
  });

  locations = [
    {label: 'Home', value: 'home'},
    {label: 'Online', value: 'online'},
    {label: 'Casino', value: 'casino' },
  ]

  constructor(private http: HttpClient) { }

  onSubmit() {
    const sessionForm = this.sessionEntry.value;
    const entry = {
      id: sessionForm.id,
      winnings: sessionForm.winnings,
      buy_in_amount: sessionForm.buy_in_amount,
      buy_out_amount: sessionForm.buy_out_amount,
      location: sessionForm.location,
      date: sessionForm.date
    }

    this.http.post( this.url + 'session/entry', entry)

    .subscribe((res: any) => {
      this.added = res.detail;
      this.sessionEntry.reset();
      setTimeout(() => {
        this.added = undefined;
      }, 2500)
    });
  }

}
