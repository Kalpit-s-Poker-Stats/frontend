import { AppRoutingModule } from "src/app/app-routing.module";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from "@angular/platform-browser";
import { NavBarComponent } from "./nav-bar.component";
import { LoginModule } from "../login/login.module";
import { ProfileIconModule } from "../profile-icon/profile-icon.module";

@NgModule({
  declarations: [
    NavBarComponent
  ],
  exports: [NavBarComponent],
  imports: [
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserModule,
    LoginModule,
    ProfileIconModule
  ],
  providers: []
})
export class NavBarModule { }
