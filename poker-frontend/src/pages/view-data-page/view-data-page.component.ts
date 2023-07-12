import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-view-data-page',
  templateUrl: './view-data-page.component.html',
  styleUrls: ['./view-data-page.component.css']
})
export class ViewDataPageComponent {

  url = 'http://147.135.113.14:5000/v1/';
  response: any;
  public chart: any;
  retrievedData: Map<string, number>;
  shouldShowCard: boolean = true;
  userInput: any;
  viewData = new FormGroup({
    id: new FormControl(),
    option: new FormControl(),
    beg_date: new FormControl(),
    end_date: new FormControl()
  });

  constructor(private http: HttpClient) { }

  getInfo() {
    this.destroyChart();
    this.userInput = this.viewData.value;
    let urlWithParams = 'session/user_data?id='
                    + this.userInput.id;
    let begDate = '';
    let endDate = '';
    const today = new Date();

    if (this.userInput.option === '2') {
      const pastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
      urlWithParams +=
                '&beg_date='
                + this.formatDateObjectForApi(pastWeek)
                + '&end_date='
                + this.formatDateObjectForApi(today);
    } else if (this.userInput.option === '3') {
      const pastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
      urlWithParams +=
                '&beg_date='
                + this.formatDateObjectForApi(pastMonth)
                + '&end_date='
                + this.formatDateObjectForApi(today);
    } else if (this.userInput.option === '4') {
      const pastYear = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
      urlWithParams +=
                '&beg_date='
                + this.formatDateObjectForApi(pastYear)
                + '&end_date='
                + this.formatDateObjectForApi(today);
    } else if (this.userInput.option === '5') {
        if (this.userInput.beg_date && this.userInput.end_date) {
                urlWithParams +=
                        '&beg_date='
                        + this.formatDateForApi(this.userInput.beg_date)
                        + '&end_date='
                        + this.formatDateForApi(this.userInput.end_date);
        }
        else if (this.userInput.beg_date && !this.userInput.end_date ) {
                begDate = this.formatDateForApi(this.userInput.beg_date);
                console.log(begDate);
                urlWithParams += '&beg_date=' + begDate;
        } else if (!this.userInput.beg_date && this.userInput.end_date) {
                endDate = this.formatDateForApi(this.userInput.end_date);
                console.log(endDate);
                urlWithParams += '&end_date=' + endDate;
        }
    }
    this.http.get(this.url + urlWithParams)
      .subscribe((res) => {
        this.response = res;
        this.retrievedData = this.getWinningsAndDate(this.response);
        this.createLineChart(this.retrievedData);
      });
  }

  destroyChart() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  formatDateForApi(dateString: string): string {
    const dateParts = dateString.split('-');
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }

  formatDateObjectForApi(date: string | Date): string {
    if (typeof date === 'string') {
      return date;
    }

    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
  getWinningsAndDate(apiResponse: any) {
    let winsAndDates = new Map();
    apiResponse.forEach((session: any) => {
      if (winsAndDates.get(session.date)) {
        let i = 2;
        while (winsAndDates.has(session.date + " session " + i)) {
          i++;
        }
        winsAndDates.set(session.date + " session " + i, session.winnings);
      } else {
        winsAndDates.set(session.date, session.winnings);
      }
    })
    return winsAndDates;
  }

  createLineChart(data: Map<string, number>) {
    let pointBackgroundColors: any = [];
    let [sessions, winnings] = this.getLineChartFormat(data);
    this.chart = new Chart("WinningsOverTime", {
      type: 'line',
      data: {
        labels: sessions,
        datasets: [
          {
            label: "Winnings",
            data: winnings,
            backgroundColor: 'black',
            borderColor: 'black',
            pointBackgroundColor: pointBackgroundColors
          }
        ]
      },
      options: {
        aspectRatio: 5
      }
    });

    let i = 0;

    for (i = 0; i < this.chart.data.datasets[0].data.length; i++) {
      if (this.chart.data.datasets[0].data[i] > 0) {
        pointBackgroundColors.push("#90cd8a");
      } else {
        pointBackgroundColors.push("#f58368");
      }
    }

    this.chart.update();

  }

  getLineChartFormat(data: any): [string[], number[]] {
    let sessions: string[] = [];
    let winnings: number[] = [];
    data.forEach((value: number, key: string) => {
      sessions.push(key);
      winnings.push(value);
    })

    return [sessions, winnings];
  }
}
