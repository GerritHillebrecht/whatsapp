import {
  AuthGuard,
  hasCustomClaim,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { Routes } from '@angular/router';

const adminOnly = () => hasCustomClaim('admin');
const registeredOnly = () => redirectUnauthorizedTo(['auth']);
const redirectLoggedInToWhatsapp = () => redirectLoggedInTo(['whatsapp']);

export const MAIN_ROUTES: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('@pages/landing/landing.module').then((m) => m.LandingModule),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('@pages/authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectLoggedInToWhatsapp },
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('@pages/profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: 'whatsapp',
    canActivate: [AuthGuard],
    data: { authGuardPipe: registeredOnly },
    loadChildren: () =>
      import('@pages/whatsapp/whatsapp.module').then((m) => m.WhatsappModule),
  },
  {
    canActivate: [AuthGuard],
    data: { authGuardPipe: registeredOnly },
    path: 'test-bench',
    loadChildren: () =>
      import('@pages/test-bench/test-bench.module').then(
        (m) => m.TestBenchModule
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
