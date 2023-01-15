import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WhatsappRoutingModule } from './whatsapp-routing.module';
import { WhatsappLayoutComponent } from './layout';
import { MessageFeedComponent, ContactFeedComponent } from './ui';
import { UserSidebarComponent } from './ui/user-sidebar/user-sidebar.component';

@NgModule({
  declarations: [WhatsappLayoutComponent],
  imports: [
    CommonModule,
    WhatsappRoutingModule,

    MessageFeedComponent,
    ContactFeedComponent,
    UserSidebarComponent
  ],
})
export class WhatsappModule {}
