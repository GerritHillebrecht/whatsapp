import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WhatsappRoutingModule } from './whatsapp-routing.module';
import { WhatsappLayoutComponent } from './layout';
import { MessageFeedComponent, ContactFeedComponent } from './ui';
import { UserSidebarComponent } from './ui/user-sidebar/user-sidebar.component';
import { NgxsModule } from '@ngxs/store';
import { WhatsappState } from './store';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { WhatsappMessageState } from './store/message/message.state';
import { WhatsappContactState } from './store/contact/contact.state';

@NgModule({
  declarations: [WhatsappLayoutComponent],
  imports: [
    CommonModule,
    WhatsappRoutingModule,

    NgxsModule.forFeature([
      WhatsappState,
      WhatsappMessageState,
      WhatsappContactState,
    ]),

    MessageFeedComponent,
    ContactFeedComponent,
    UserSidebarComponent,
  ],
})
export class WhatsappModule {}
