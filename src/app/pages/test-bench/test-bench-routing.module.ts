import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestBenchLayoutComponent } from './layout/test-bench-layout/test-bench-layout.component';

const routes: Routes = [
  {
    path: '',
    component: TestBenchLayoutComponent,
    children: [
      {
        path: 'snail',
        loadComponent: () =>
          import('./js-battles/snail/snail.component').then(
            (m) => m.SnailComponent
          ),
      },
      {
        path: 'optimistic-ui',
        loadComponent: () =>
          import(
            './personal-testing/graphql-optimistic-response/graphql-optimistic-response.component'
          ).then((m) => m.GraphqlOptimisticResponseComponent),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestBenchRoutingModule {}
