import { ThemeStateModel } from './theme.state';

export class SetTheme {
  static readonly type = '[Theme] Set Theme';
  constructor(public colorScheme: ThemeStateModel['colorScheme']) {}
}

export class SetMode {
  static readonly type = '[Theme] Set Mode';
  constructor(public mode: ThemeStateModel['mode']) {}
}
