import { AppRoutingModule } from "src/app/app-routing.module";
import { HomePageComponent } from "./home-page.component";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HomePageComponent
  ],
  exports: [HomePageComponent],
  imports: [
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: []
})
export class HomePageModule { }
