import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Select, Store } from '@ngxs/store';
import { SetMode, SetTheme, ThemeStateModel } from '@core/store/theme';
import { Observable } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-darkmode-toggle',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, MatMenuModule, MatIconModule],
  templateUrl: './darkmode-toggle.component.html',
  styleUrls: ['./darkmode-toggle.component.scss'],
})
export class DarkmodeToggleComponent {
  @Select((state: any) => state.theme.colorScheme)
  colorScheme$!: Observable<'light' | 'dark'>;

  @Input()
  size: string = '2.5rem';

  dark = false;
  animate = false;

  constructor(private store: Store) {
    this.colorScheme$.subscribe((colorScheme) => {
      this.dark = colorScheme === 'dark';
    });
  }

  clickHandler(mode: ThemeStateModel['mode']) {
    this.animate = false;
    setTimeout(() => {
      this.animate = true;
    }, 1);

    this.store.dispatch([
      new SetMode(mode),
      new SetTheme(mode === 'os' ? (this.dark ? 'dark' : 'light') : mode),
    ]);
  }
}
