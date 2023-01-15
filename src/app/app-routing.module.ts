import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MAIN_ROUTES } from '@core/routes';

@NgModule({
  imports: [RouterModule.forRoot(MAIN_ROUTES)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
