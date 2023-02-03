import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Application } from '@splinetool/runtime';
import { LogoComponent } from '@shared/ui/logo';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-phone-mask-section',
  standalone: true,
  imports: [CommonModule, LogoComponent, RouterModule],
  templateUrl: './phone-mask-section.component.html',
  styleUrls: ['./phone-mask-section.component.scss'],
})
export class PhoneMaskSectionComponent implements OnInit {
  ngOnInit(): void {
    const canvasRef = document.getElementById('canvas3d') as HTMLCanvasElement;
    const app = new Application(canvasRef);
    app
      .load('https://prod.spline.design/vn5s4dnj4RJEENam/scene.splinecode')
      .then((canvas) => {
        canvasRef.classList.add('animate');
        return canvas;
      });
  }
}
