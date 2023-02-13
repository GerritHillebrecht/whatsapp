import { InjectionToken } from '@angular/core';

export const STORAGE_IMAGE_PATH = new InjectionToken<string>(
  'STORAGE_IMAGE_PATH',
  {
    factory: () => 'assets/images/whatsapp',
  }
);
