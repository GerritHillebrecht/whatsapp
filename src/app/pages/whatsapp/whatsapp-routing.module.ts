import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WhatsappLayoutComponent } from './layout';

const routes: Routes = [
  {
    path: '',
    component: WhatsappLayoutComponent,
  },
  {
    path: 'chat',
    loadComponent: () =>
      import('./ui/message-feed').then((c) => c.MessageFeedComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WhatsappRoutingModule {}
