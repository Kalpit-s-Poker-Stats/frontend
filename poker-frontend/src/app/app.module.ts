import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { HomePageModule } from 'src/pages/home-page/home-page.module';
import { SessionEntryPageModule } from 'src/pages/session-entry-page/session-entry-page.module';
import { ViewDataPageModule } from 'src/pages/view-data-page/view-data-page.module';
import { NavBarModule } from 'src/components/nav-bar/nav-bar.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HomePageModule,
    SessionEntryPageModule,
    ViewDataPageModule,
    NavBarModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
