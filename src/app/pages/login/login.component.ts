import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

type Role = 'cliente' | 'agente';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  selectedRole = signal<Role>('cliente');
  loading      = signal(false);
  error        = signal<string | null>(null);

  constructor(private supabase: SupabaseService) {}

  selectRole(role: Role) {
    this.selectedRole.set(role);
  }

  signInWithGoogle() {
    this.loading.set(true);
    this.error.set(null);
    this.supabase.signInWithGoogle().subscribe({
      error: (err) => {
        this.error.set('No se pudo iniciar sesión. Intenta nuevamente.');
        this.loading.set(false);
        console.error(err);
      },
    });
  }
}
