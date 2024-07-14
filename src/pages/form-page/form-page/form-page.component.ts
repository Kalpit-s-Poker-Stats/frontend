import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { SplitwiseService } from 'src/services/splitwise.service';
import { userCreate } from 'src/models/userCreate';

@Component({
  selector: 'app-form-page',
  templateUrl: './form-page.component.html',
  styleUrls: ['./form-page.component.css']
})
export class FormPageComponent {
  name: string | undefined;
  winnings: number | undefined;
  response: string;
  added: string | undefined;
  myLink = 'https://www.splitwise.com/join/oxfNwJiC9F2+qewjz';
  url = environment.apiUrl;

  sessionEntry = new FormGroup({
    name: new FormControl(),
    pn_id: new FormControl(),
    splitwise_email: new FormControl(),
    discord_username: new FormControl(),
    acknowledgment: new FormControl(),
  });

  userModel: userCreate;

  inputForm: FormGroup;

  responseCodeFromEndpoint: number = -1;

  constructor(private http: HttpClient, private fb: FormBuilder, private splitwiseService: SplitwiseService) { }

  ngOnInit(): void {
    this.inputForm = this.fb.group({
      names: ['', Validators.required],
      numbers: ['', Validators.required]
    });
  }

  onSubmit() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });

    console.log(this.sessionEntry.value);

    this.http.post(this.url + "profile/create_user_profile", this.sessionEntry.value, { headers }).subscribe(
      (response) => {
        this.responseCodeFromEndpoint = 200;
        this.response = response.toString();
      },
      (error) => {
        this.responseCodeFromEndpoint = error.status;
        console.log(this.responseCodeFromEndpoint);
      }
    )
  }


  errorCode(): number {
    if(this.responseCodeFromEndpoint === 404) {
      return 404;
    } else if(this.responseCodeFromEndpoint === -1) {
      return 200;
    } else if( this.responseCodeFromEndpoint === 409) {
      return 409;
    } else {
      return 500;
    }
  }

  backToForm() {
    this.responseCodeFromEndpoint = -1;
    this.sessionEntry.reset();
  }
}
