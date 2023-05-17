import { AppRoutingModule } from "src/app/app-routing.module";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from "@angular/platform-browser";
import { ViewDataPageComponent } from "./view-data-page.component";

@NgModule({
  declarations: [
    ViewDataPageComponent
  ],
  exports: [ViewDataPageComponent],
  imports: [
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserModule
  ],
  providers: []
})
export class ViewDataPageModule { }
