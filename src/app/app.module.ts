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
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgChartsModule } from 'ng2-charts';
import { FormPageModule } from 'src/pages/form-page/form-page/form-page.module';
import { DiscordCallbackModule } from 'src/components/discord-callback/discord-callback.module';


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
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    NgChartsModule,
    FormPageModule,
    DiscordCallbackModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
