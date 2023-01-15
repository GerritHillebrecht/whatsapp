import { Injectable } from '@angular/core';
import { fromEvent, map, Observable, shareReplay, startWith, tap } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root',
})
export class ScreenSizeService {
  xSmall$: Observable<boolean>;
  twSm$: Observable<boolean>;
  isPhone$: Observable<boolean>;
  isHandset$: Observable<boolean>;
  isTablet$: Observable<boolean>;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.twSm$ = this.breakpointObserver.observe('(max-width: 640px)').pipe(
      map((result) => result.matches),
      shareReplay(1)
    );

    this.isHandset$ = this.breakpointObserver
      .observe([Breakpoints.Handset])
      .pipe(
        map((result) => result.matches),
        shareReplay(1)
      );

    this.xSmall$ = this.breakpointObserver.observe([Breakpoints.XSmall]).pipe(
      map((result) => result.matches),
      shareReplay(1)
    );

    this.isPhone$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
      map((result) => result.matches),
      shareReplay(1)
    );

    this.isTablet$ = this.breakpointObserver
      .observe([Breakpoints.TabletLandscape, Breakpoints.TabletPortrait])
      .pipe(
        map((result) => result.matches),
        shareReplay(1)
      );
  }
}
