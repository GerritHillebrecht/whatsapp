import {
  AfterViewInit,
  Component,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { from, Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { ThemeState, ThemeStateModel } from '@core/store/theme';
import { ScreenSizeService } from '@core/services/screen-size';
import { RouterModule } from '@angular/router';

@Directive({
  selector: '[shining-border]',
  standalone: true,
})
export class ShiningBorderDirective implements AfterViewInit {
  cards: NodeListOf<HTMLDivElement> | undefined;

  ngAfterViewInit(): void {
    this.cards = this.el.nativeElement.querySelectorAll('.card');
  }

  constructor(private el: ElementRef<HTMLDivElement>) {}

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const { clientX, clientY } = event;

    this.cards!.forEach((card) => {
      const { left, top } = card.getBoundingClientRect();
      const x = clientX - left;
      const y = clientY - top;

      card.style.setProperty('--xPos', `${x}px`);
      card.style.setProperty('--yPos', `${y}px`);
    });
  }
}

@Directive({
  selector: '[tilt-card]',
  standalone: true,
})
export class TiltCardDirective implements AfterViewInit {
  @Input()
  tiltPercent = 10;

  childCard: HTMLAnchorElement | null | undefined;

  constructor(private el: ElementRef<HTMLDivElement>) {}

  ngAfterViewInit(): void {
    this.childCard = this.el.nativeElement.querySelector('a');
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.childCard?.style.setProperty(
      'transform',
      'rotateX(0deg) rotateY(0deg)'
    );
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const { clientX, clientY } = event;
    const { left, top } = this.el.nativeElement.getBoundingClientRect();
    const centerX = this.el.nativeElement.offsetWidth / 2 + left;
    const centerY = this.el.nativeElement.offsetHeight / 2 + top;

    const relX = Math.round(
      ((clientX - centerX) / (this.el.nativeElement.offsetWidth / 2)) *
        this.tiltPercent
    );
    const relY = Math.round(
      ((clientY - centerY) / (this.el.nativeElement.offsetHeight / 2)) *
        this.tiltPercent
    );
    this.childCard?.style.setProperty(
      'transform',
      `rotateX(${relY}deg) rotateY(${-relX}deg)`
    );
  }
}

@Component({
  selector: 'app-libraries-section',
  standalone: true,
  imports: [
    CommonModule,
    ShiningBorderDirective,
    TiltCardDirective,
    NgOptimizedImage,
    MatSliderModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './libraries-section.component.html',
  styleUrls: ['./libraries-section.component.scss'],
})
export class LibrariesSectionComponent implements OnInit {
  showSettings = false;
  perspective = 1000;
  tiltPercent = 10;
  color: string = '#d946ef;';
  small$: Observable<boolean>;

  constructor(private store: Store, private screenSize: ScreenSizeService) {
    this.small$ = this.screenSize.twSm$;
  }

  ngOnInit(): void {
    this.store.select(ThemeState).subscribe((themeState: ThemeStateModel) => {
      const element = document.querySelector('.cards') as HTMLDivElement;
      if (themeState.colorScheme === 'dark') {
        element.style.setProperty('--gradient-color', `217, 70, 239`);
        return (this.color = '#d946ef');
      }

      element.style.setProperty('--gradient-color', `73, 45, 77`);
      return (this.color = '#d946ef');
    });
  }

  calculateRGB(event: any) {
    const element = document.querySelector('.cards') as HTMLDivElement;
    const rgb = event.target?.value;
    const r = parseInt(rgb.substr(1, 2), 16);
    const g = parseInt(rgb.substr(3, 2), 16);
    const b = parseInt(rgb.substr(5, 2), 16);
    this.color = rgb;
    element.style.setProperty('--gradient-color', `${r}, ${g}, ${b}`);
  }

  cards: { img: string; label: string; link: string }[] = [
    {
      label: 'Angular',
      img: 'https://cdn.worldvectorlogo.com/logos/angular-icon.svg',
      link: 'https://angular.io/',
    },
    {
      label: 'Tailwind',
      img: 'https://cdn.worldvectorlogo.com/logos/tailwind-css-2.svg',
      link: 'https://tailwindcss.com/',
    },
    {
      label: 'NestJS',
      img: 'https://cdn.worldvectorlogo.com/logos/nestjs.svg',
      link: 'https://nestjs.com/',
    },
    {
      label: 'PostgreSQL',
      img: 'https://cdn.worldvectorlogo.com/logos/postgresql.svg',
      link: 'https://www.postgresql.org/',
    },
    {
      label: 'Firebase',
      img: 'https://cdn.worldvectorlogo.com/logos/firebase-1.svg',
      link: 'https://firebase.google.com/',
    },
    {
      label: 'Material Design',
      img: 'https://cdn.worldvectorlogo.com/logos/material-ui-1.svg',
      link: 'https://material.angular.io/',
    },
  ];
}
