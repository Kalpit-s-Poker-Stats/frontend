import { AppRoutingModule } from "src/app/app-routing.module";
import { HttpClientModule } from "@angular/common/http";
import { NgModule} from "@angular/core";
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from "@angular/platform-browser";
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { SplitwiseService } from "src/services/splitwise.service";
import { FormPageComponent } from "./form-page.component";
import {MatCheckboxModule} from '@angular/material/checkbox';

@NgModule({
  declarations: [
    FormPageComponent
  ],
  exports: [FormPageComponent],
  imports: [
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserModule,
    MatCardModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  providers: [SplitwiseService]
})



export class FormPageModule { }
