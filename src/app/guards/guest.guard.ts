import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { map, take } from 'rxjs';

/**
 * Bloquea el login si ya hay sesión activa.
 * EXCEPCIÓN: si la URL tiene #access_token (callback de OAuth)
 * deja pasar siempre para que Supabase procese el token.
 */
export const guestGuard: CanActivateFn = () => {
  // Dejar pasar el callback de OAuth sin bloquear
  if (window.location.hash.includes('access_token')) {
    return true;
  }

  const supabase = inject(SupabaseService);
  const router   = inject(Router);

  return supabase.session$.pipe(
    take(1),
    map(session => session ? router.createUrlTree(['/']) : true)
  );
};
