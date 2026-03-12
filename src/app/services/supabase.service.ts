import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createClient, Session, SupabaseClient, User } from '@supabase/supabase-js';
import { from, Observable, ReplaySubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient;

  /**
   * ReplaySubject(1): los guards NO reciben null inicial —
   * esperan hasta que Supabase emita el primer estado real
   * (INITIAL_SESSION o SIGNED_IN).
   */
  private _session$ = new ReplaySubject<Session | null>(1);
  private _user$    = new ReplaySubject<User | null>(1);

  readonly session$ = this._session$.asObservable();
  readonly user$    = this._user$.asObservable();

  constructor(private router: Router) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey, {
      auth: {
        // Bypass Navigator.locks
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        lock: ((_n: string, _t: number, fn: () => Promise<any>) => fn()) as any,
        persistSession:     true,
        detectSessionInUrl: true,
        flowType:           'implicit',
      },
    });

    /**
     * onAuthStateChange es la única fuente de verdad.
     * Supabase siempre dispara INITIAL_SESSION al arrancar.
     * Si hay #access_token en la URL, luego dispara SIGNED_IN.
     */
    this.supabase.auth.onAuthStateChange((event, session) => {
      this._session$.next(session);
      this._user$.next(session?.user ?? null);

      if (event === 'SIGNED_IN') {
        // Limpiar el hash de la URL y redirigir al home
        window.history.replaceState(null, '', window.location.pathname);
        this.router.navigate(['/']);
      }

      if (event === 'SIGNED_OUT') {
        this.router.navigate(['/login']);
      }
    });
  }

  signInWithGoogle(): Observable<void> {
    return from(
      this.supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/login` },
      }).then(() => {})
    );
  }

  signOut(): Observable<void> {
    return from(
      this.supabase.auth.signOut().then(() => {})
    );
  }

  get currentUser(): User | null {
    let user: User | null = null;
    this._user$.subscribe(u => (user = u)).unsubscribe();
    return user;
  }
}
