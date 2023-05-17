import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { HomePageModule } from 'src/pages/home-page/home-page.module';
import { SessionEntryPageModule } from 'src/pages/session-entry-page/session-entry-page.module';
import { ViewDataPageModule } from 'src/pages/view-data-page/view-data-page.module';

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
    ViewDataPageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
