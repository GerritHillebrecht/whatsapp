import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Select, Store } from '@ngxs/store';
import { SetTheme } from '@core/store/theme';
import { Observable } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-darkmode-toggle',
  standalone: true,
  imports: [CommonModule, MatTooltipModule],
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

  clickHandler() {
    this.animate = false;
    setTimeout(() => {
      this.animate = true;
    }, 1);

    this.store.dispatch(new SetTheme(this.dark ? 'light' : 'dark'));
  }
}
