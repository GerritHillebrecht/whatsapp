import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseModule } from './config/firebase';
import { NgxsConfigModule } from './config/ngxs';
import { GraphQLModule } from './config/graphql';

import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [FirebaseModule, NgxsConfigModule, GraphQLModule, MatSnackBarModule],
})
export class CoreModule {}
