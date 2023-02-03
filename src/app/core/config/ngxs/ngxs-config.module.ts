import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { environment } from '@env/environment';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { ThemeState } from '@core/store/theme/theme.state';
import { AuthenticationState } from '@auth/store/authentication.state';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgxsModule.forRoot(
      [
        ThemeState,
        AuthenticationState,
      ],
      {
        developmentMode: !environment.production,
      }
    ),
    NgxsLoggerPluginModule.forRoot({
      disabled: environment.production,
    }),
    NgxsStoragePluginModule.forRoot(),
  ],
  exports: [NgxsModule, NgxsLoggerPluginModule, NgxsStoragePluginModule],
})
export class NgxsConfigModule {}
