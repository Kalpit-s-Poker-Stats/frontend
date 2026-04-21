import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SplitwiseService } from 'src/services/splitwise.service';
import { AuthService } from 'src/services/auth.service';
import { userCreate } from 'src/models/userCreate';

@Component({
  selector: 'app-form-page',
  templateUrl: './form-page.component.html',
  styleUrls: ['./form-page.component.css']
})
export class FormPageComponent implements OnInit {
  name: string | undefined;
  winnings: number | undefined;
  response: string;
  added: string | undefined;
  myLink = 'https://www.splitwise.com/join/oxfNwJiC9F2+qewjz';
  url = environment.apiUrl;

  // Discord sign-up flow
  isFromDiscord = false;
  discordUsername: string | null = null;
  discordId: string | null = null;

  sessionEntry = new FormGroup({
    name: new FormControl(),
    pn_id: new FormControl(),
    splitwise_email: new FormControl(),
    discord_username: new FormControl(),
    discord_id: new FormControl(),
    acknowledgment: new FormControl(),
  });

  userModel: userCreate;

  inputForm: FormGroup;

  responseCodeFromEndpoint: number = -1;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private splitwiseService: SplitwiseService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.inputForm = this.fb.group({
      names: ['', Validators.required],
      numbers: ['', Validators.required]
    });

    // Check if coming from Discord login
    this.route.queryParams.subscribe(params => {
      if (params['from_discord'] === 'true') {
        this.isFromDiscord = true;
        this.discordUsername = params['discord_username'] || null;
        this.discordId = params['discord_id'] || null;

        // Auto-populate discord fields
        if (this.discordUsername) {
          this.sessionEntry.patchValue({
            discord_username: this.discordUsername,
            discord_id: this.discordId
          });
        }
      }
    });
  }

  onSubmit() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });

    console.log(this.sessionEntry.value);

    this.http.post<any>(this.url + "profile/create_user_profile", this.sessionEntry.value, { headers }).subscribe(
      (response) => {
        this.responseCodeFromEndpoint = 200;
        this.response = response?.message ?? '';

        // If coming from Discord, log the user in and redirect to home
        if (this.isFromDiscord && response?.user) {
          this.authService.setCurrentUser(response.user);
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 2000);
        }
      },
      (error) => {
        this.responseCodeFromEndpoint = error.status;
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
