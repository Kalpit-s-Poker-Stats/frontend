import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from 'src/pages/home-page/home-page.component';
import { SessionEntryPageComponent } from 'src/pages/session-entry-page/session-entry-page.component';
import { ViewDataPageComponent } from 'src/pages/view-data-page/view-data-page.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'session-entry', component: SessionEntryPageComponent },
  { path: 'view-data', component: ViewDataPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
