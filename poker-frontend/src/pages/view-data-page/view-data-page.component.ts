import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { Chart } from 'chart.js';

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

    this.http.get(this.url + urlWithParams)
    .subscribe((res) => {
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
  private breakpointObserver = inject(BreakpointObserver);

  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Card 1', cols: 1, rows: 1 },
          { title: 'Card 2', cols: 1, rows: 1 },
          { title: 'Card 3', cols: 1, rows: 1 },
          { title: 'Card 4', cols: 1, rows: 1 }
        ];
      }

      return [
        { title: 'Card 1', cols: 2, rows: 1 },
        { title: 'Card 2', cols: 1, rows: 1 },
        { title: 'Card 3', cols: 1, rows: 2 },
        { title: 'Card 4', cols: 1, rows: 1 }
      ];
    })
  );

}


