import { Platform } from '@angular/cdk/platform';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PlatformService {
  isIOS: boolean;

  constructor(private platform: Platform) {
    this.isIOS = this.platform.IOS;
  }
}
