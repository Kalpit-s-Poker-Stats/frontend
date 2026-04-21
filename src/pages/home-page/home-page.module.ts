import { AppRoutingModule } from "src/app/app-routing.module";
import { HomePageComponent } from "./home-page.component";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [
    HomePageComponent
  ],
  exports: [HomePageComponent],
  imports: [
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserModule,
    CommonModule,
    MatCardModule
  ],
  providers: []
})
export class HomePageModule { }
