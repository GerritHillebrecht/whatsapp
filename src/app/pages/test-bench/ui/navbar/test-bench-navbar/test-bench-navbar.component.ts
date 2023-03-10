import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { DarkmodeToggleComponent } from '@shared/ui/toogle/darkmode';

@Component({
  selector: 'app-test-bench-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    RouterModule,
    DarkmodeToggleComponent,
  ],
  templateUrl: './test-bench-navbar.component.html',
  styleUrls: ['./test-bench-navbar.component.scss'],
})
export class TestBenchNavbarComponent {
  links = [
    { path: '/test-bench/shining-border', label: 'Shining Border' },
    { path: '/test-bench/optimistic-ui', label: 'Optimistic-Ui' },
    { path: '/test-bench/snail', label: 'Snail' },
  ];
}
