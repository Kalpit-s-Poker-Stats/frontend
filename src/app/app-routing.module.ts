import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormPageComponent } from 'src/pages/form-page/form-page/form-page.component';
import { HomePageComponent } from 'src/pages/home-page/home-page.component';
import { SessionEntryPageComponent } from 'src/pages/session-entry-page/session-entry-page.component';
import { sessionEntryPageGuard } from 'src/pages/session-entry-page/session-entry-page.guard';
import { ViewDataPageComponent } from 'src/pages/view-data-page/view-data-page.component';
import { DiscordCallbackComponent } from 'src/components/discord-callback/discord-callback.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'session-entry', component: SessionEntryPageComponent, canActivate: [sessionEntryPageGuard]},
  { path: 'view-data', component: ViewDataPageComponent },
  { path: 'sign-up', component: FormPageComponent },
  { path: 'auth/discord/callback', component: DiscordCallbackComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
