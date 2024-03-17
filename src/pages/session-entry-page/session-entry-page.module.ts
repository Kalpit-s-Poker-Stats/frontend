import { AppRoutingModule } from "src/app/app-routing.module";
import { HttpClientModule } from "@angular/common/http";
import { NgModule} from "@angular/core";
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from "@angular/platform-browser";
import { SessionEntryPageComponent } from "./session-entry-page.component";
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';

@NgModule({
  declarations: [
    SessionEntryPageComponent
  ],
  exports: [SessionEntryPageComponent],
  imports: [
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserModule,
    MatCardModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatSelectModule
  ],
  providers: []
})



export class SessionEntryPageModule { }
