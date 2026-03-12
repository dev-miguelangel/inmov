import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { map, take } from 'rxjs';

/**
 * Permite la ruta solo si hay sesión activa.
 * Usa ReplaySubject → espera el primer estado real de Supabase.
 */
export const authGuard: CanActivateFn = () => {
  const supabase = inject(SupabaseService);
  const router   = inject(Router);

  return supabase.session$.pipe(
    take(1),
    map(session => session ? true : router.createUrlTree(['/login']))
  );
};
