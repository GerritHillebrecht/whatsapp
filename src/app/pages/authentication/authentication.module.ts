import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { AuthenticationLayoutComponent } from './layout';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [AuthenticationLayoutComponent],
  imports: [CommonModule, AuthenticationRoutingModule, MatButtonModule],
})
export class AuthenticationModule {}
