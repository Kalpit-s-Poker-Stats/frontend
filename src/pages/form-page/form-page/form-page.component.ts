import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SplitwiseService } from 'src/services/splitwise.service';

@Component({
  selector: 'app-form-page',
  templateUrl: './form-page.component.html',
  styleUrls: ['./form-page.component.css']
})
export class FormPageComponent {
  name: string | undefined;
  winnings: number | undefined;
  response: Object | undefined;
  added: string | undefined;
  myLink = 'https://www.splitwise.com/join/GJWczrgAMYF';

  sessionEntry = new FormGroup({
    name: new FormControl(),
    pn_id: new FormControl(),
    splitwise_email: new FormControl(),
    discord_username: new FormControl(),
    acknowledgement: new FormControl(),
  });

  inputForm: FormGroup;

  constructor(private http: HttpClient, private fb: FormBuilder, private splitwiseService: SplitwiseService) { }

  ngOnInit(): void {
    this.inputForm = this.fb.group({
      names: ['', Validators.required],
      numbers: ['', Validators.required]
    });
  }

  onSubmit() {
    
  }
}
