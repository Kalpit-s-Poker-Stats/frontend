import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscordCallbackComponent } from './discord-callback.component';

@NgModule({
  declarations: [DiscordCallbackComponent],
  imports: [CommonModule],
  exports: [DiscordCallbackComponent]
})
export class DiscordCallbackModule {}
