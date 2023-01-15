import { ThemeStateModel } from './theme.state';

export class SetTheme {
  static readonly type = '[Theme] Set Theme';
  constructor(public colorScheme: ThemeStateModel['colorScheme']) {}
}
