import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestBenchRoutingModule } from './test-bench-routing.module';
import { TestBenchLayoutComponent } from './layout/test-bench-layout/test-bench-layout.component';
import { TestBenchNavbarComponent } from './ui/navbar/test-bench-navbar/test-bench-navbar.component';


@NgModule({
  declarations: [
    TestBenchLayoutComponent
  ],
  imports: [
    CommonModule,
    TestBenchRoutingModule,

    TestBenchNavbarComponent,
  ]
})
export class TestBenchModule { }
