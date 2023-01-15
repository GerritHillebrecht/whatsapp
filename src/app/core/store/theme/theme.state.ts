import { Injectable } from '@angular/core';
import { State, Action, StateContext, NgxsOnInit } from '@ngxs/store';
import { startWith } from 'rxjs';
import { fromEvent } from 'rxjs';
import { SetTheme } from './theme.actions';

export interface ThemeStateModel {
  colorScheme: 'light' | 'dark';
  mode: 'light' | 'dark' | 'os';
}

const defaults: ThemeStateModel = {
  colorScheme: 'light',
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
    { patchState }: StateContext<ThemeStateModel>,
    { colorScheme }: SetTheme
  ) {
    patchState({ colorScheme });
    colorScheme === 'dark'
      ? document.documentElement.classList.add('dark')
      : document.documentElement.classList.remove('dark');
  }
}
