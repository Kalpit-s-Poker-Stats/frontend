import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProfileIconComponent } from './profile-icon.component';

@NgModule({
  declarations: [ProfileIconComponent],
  imports: [CommonModule, RouterModule],
  exports: [ProfileIconComponent]
})
export class ProfileIconModule { }