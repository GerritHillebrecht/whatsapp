import { Injectable } from '@angular/core';
import { State, Action, StateContext, NgxsOnInit } from '@ngxs/store';
import { startWith } from 'rxjs';
import { fromEvent } from 'rxjs';
import { SetMode, SetTheme, UpdateThemeColor } from './theme.actions';

export interface ThemeStateModel {
  colorScheme: 'light' | 'dark';
  mode: 'light' | 'dark' | 'os';
}

const defaults: ThemeStateModel = {
  colorScheme: 'dark',
  mode: 'os',
};

@State<ThemeStateModel>({
  name: 'theme',
  defaults,
})
@Injectable()
export class ThemeState implements NgxsOnInit {
  ngxsOnInit({ getState, dispatch }: StateContext<ThemeStateModel>) {
    dispatch(new SetTheme(getState().colorScheme));

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    fromEvent<MediaQueryList>(mediaQuery, 'change')
      .pipe(startWith(mediaQuery))
      .subscribe((darkScheme: MediaQueryList) => {
        if (getState().mode === 'os') {
          dispatch(new SetTheme(darkScheme.matches ? 'dark' : 'light'));
        }
      });
  }

  @Action(SetTheme)
  setTheme(
    { patchState, dispatch }: StateContext<ThemeStateModel>,
    { colorScheme }: SetTheme
  ) {
    patchState({ colorScheme, mode: colorScheme });
    colorScheme === 'dark'
      ? document.documentElement.classList.add('dark')
      : document.documentElement.classList.remove('dark');
  }

  @Action(SetMode)
  setMode({ patchState }: StateContext<ThemeStateModel>, { mode }: SetMode) {
    patchState({ mode });
  }

  @Action(UpdateThemeColor)
  updateThemeColor(
    { patchState }: StateContext<ThemeStateModel>,
    { color }: UpdateThemeColor
  ) {
    const themeColorSelector = document.querySelector('meta[name=theme-color]');
    themeColorSelector?.setAttribute('content', color);
  }
}
