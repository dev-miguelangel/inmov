import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {
  supabase = inject(SupabaseService);
  user$    = this.supabase.user$;

  activeRole  = signal<'cliente' | 'agente'>('cliente');
  modalOpen   = signal(false);
  modalRole   = signal<'cliente' | 'agente' | null>(null);

  steps = {
    cliente: [
      { icon: '🔑', title: 'Ingresa con Google', desc: 'Sin contraseñas. Un clic y estás dentro.' },
      { icon: '📝', title: 'Crea tu perfil',     desc: 'Añade tu información, historial y referencias.' },
      { icon: '🔍', title: 'Explora propiedades', desc: 'Navega el feed tipo Pinterest y filtra.' },
      { icon: '🚀', title: 'Postula',             desc: 'Envía tu postulación en segundos.' },
    ],
    agente: [
      { icon: '🔑', title: 'Ingresa con Google',  desc: 'Sin contraseñas. Un clic y estás dentro.' },
      { icon: '🏅', title: 'Crea tu perfil agente', desc: 'Muestra trayectoria y reseñas de clientes.' },
      { icon: '📋', title: 'Publica una propiedad', desc: 'Arriendo o venta. Foto, precio y listo.' },
      { icon: '📬', title: 'Gestiona postulaciones', desc: 'Revisa perfiles de clientes interesados.' },
    ],
  };

  properties = [
    { photo: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80', type: 'Arriendo', title: 'Casa amplia, Providencia',       detail: '3 dorm · 2 baños · 120 m²', price: '$780.000/mes',   agent: 'MA', agentColor: '#2563EB', agentName: 'M. Aguilera', height: 'tall' },
    { photo: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80', type: 'Venta',    title: 'Depto. moderno, Vitacura',        detail: '2 dorm · 2 baños · 75 m²',  price: 'UF 5.400',       agent: 'CR', agentColor: '#F97316', agentName: 'C. Rojas',    height: 'short' },
    { photo: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80', type: 'Arriendo', title: 'Estudio con terraza, Ñuñoa',   detail: '1 dorm · 1 baño · 38 m²',  price: '$430.000/mes',   agent: 'LP', agentColor: '#10B981', agentName: 'L. Pinto',    height: 'tall' },
    { photo: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80', type: 'Arriendo', title: 'Depto. iluminado, Las Condes', detail: '2 dorm · 1 baño · 65 m²',  price: '$620.000/mes',   agent: 'VG', agentColor: '#8B5CF6', agentName: 'V. Godoy',    height: 'short' },
    { photo: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600&q=80', type: 'Arriendo', title: 'Casa con piscina, Lo Barnechea', detail: '4 dorm · 3 baños · 200 m²', price: '$1.200.000/mes', agent: 'JM', agentColor: '#EF4444', agentName: 'J. Muñoz',   height: 'tall' },
    { photo: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80', type: 'Venta',    title: 'Depto. nuevo, Santiago Centro',  detail: '2 dorm · 1 baño · 55 m²',  price: 'UF 3.100',       agent: 'AT', agentColor: '#0EA5E9', agentName: 'A. Torres',   height: 'short' },
    { photo: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80', type: 'Arriendo', title: 'Depto. iluminado, Macul',         detail: '2 dorm · 1 baño · 62 m²',  price: '$480.000/mes',   agent: 'BF', agentColor: '#D97706', agentName: 'B. Fuentes',  height: 'tall' },
    { photo: 'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=600&q=80', type: 'Arriendo', title: 'Casa con jardín, La Florida',   detail: '3 dorm · 2 baños · 140 m²', price: '$700.000/mes',  agent: 'RM', agentColor: '#059669', agentName: 'R. Miranda',  height: 'short' },
  ];

  agents = [
    { initials: 'MA', bg: '#EFF6FF', emoji: '👩‍💼', name: 'María Aguilera',  role: 'Agente · 8 años de experiencia',       stars: 5, rec: '"Excelente gestión, muy transparente."',      tags: ['Arriendo', 'Providencia', 'Las Condes'] },
    { initials: 'CR', bg: '#FFF7ED', emoji: '🧑‍💼', name: 'Carlos Rojas',    role: 'Agente · Especialista en ventas',       stars: 4, rec: '"Me ayudó a encontrar el depto perfecto."',   tags: ['Venta', 'Vitacura', 'Lo Barnechea'] },
    { initials: 'AP', bg: '#F0FFF4', emoji: '👨‍🎓', name: 'Andrés Pérez',   role: 'Cliente · Arrendatario verificado',      stars: 5, rec: '"Siempre pagó a tiempo." — Agente M.A.',     tags: ['Historial limpio', 'Referenciado'] },
    { initials: 'VG', bg: '#FDF4FF', emoji: '👩‍🏠', name: 'Valentina Godoy', role: 'Agente · Propiedades comerciales',      stars: 5, rec: '"Profesional, honesta, conoce el mercado."', tags: ['Comercial', 'Oficinas', 'Vitacura'] },
  ];

  stats = [
    { num: '1.200+', label: 'Propiedades publicadas' },
    { num: '4.800+', label: 'Clientes registrados' },
    { num: '320+',   label: 'Agentes verificados' },
    { num: '98%',    label: 'Satisfacción' },
  ];

  openModal(role?: 'cliente' | 'agente') {
    this.modalRole.set(role ?? null);
    this.modalOpen.set(true);
  }
  closeModal() { this.modalOpen.set(false); }

  starsArray(n: number) { return Array(5).fill(0).map((_, i) => i < n ? '★' : '☆'); }
}
