import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-view-data-page',
  templateUrl: './view-data-page.component.html',
  styleUrls: ['./view-data-page.component.css']
})
export class ViewDataPageComponent {

  url = 'http://147.135.113.14:5000/v1/';
  response: any;

  viewData = new FormGroup({
    id: new FormControl(),
    beg_date: new FormControl(),
    end_date: new FormControl()
  });

  constructor(private http: HttpClient) { }

  getInfo() {
    const userInput = this.viewData.value;
    const urlWithParams = 'session/user_data?id=' + userInput.id + '&beg_date=' + this.formatDateForApi(userInput.beg_date) + '&end_date=' + this.formatDateForApi(userInput.end_date);
    console.log(urlWithParams);

    this.http.get(this.url + urlWithParams)
    .subscribe((res) => {
      console.log(res);
      this.response = res;
    })
  }

  formatDateForApi(dateString: string): string {
    const dateParts = dateString.split('-');
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];
    
    const formattedDate = `${month}%2F${day}%2F${year}`;
    return formattedDate;
  }

}
