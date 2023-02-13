import { InjectionToken } from '@angular/core';

export const QUERY_LIMIT = new InjectionToken<number>('QUERY_LIMIT', {
  factory: () => 1000,
});
