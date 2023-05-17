import { AppRoutingModule } from "src/app/app-routing.module";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from "@angular/platform-browser";
import { SessionEntryPageComponent } from "./session-entry-page.component";

@NgModule({
  declarations: [
    SessionEntryPageComponent
  ],
  exports: [SessionEntryPageComponent],
  imports: [
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserModule
  ],
  providers: []
})
export class SessionEntryPageModule { }
