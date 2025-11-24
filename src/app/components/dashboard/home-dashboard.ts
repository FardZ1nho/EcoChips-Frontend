import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';  // <- IMPORTANTE: Agrega esta línea

interface MenuItem {
  id: string;
  label: string;
  hasSubmenu: boolean;
  submenuItems?: SubMenuItem[];
  route?: string;
}

interface SubMenuItem {
  label: string;
  route: string;
}

@Component({
  selector: 'app-home-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet],  // <- IMPORTANTE: Agrega esta línea
  templateUrl: './home-dashboard.html',
  styleUrls: ['./home-dashboard.css']
})
export class HomeDashboard {
  openSubmenu: string | null = null;

  menuItems: MenuItem[] = [
    { 
      id: 'inicio', 
      label: 'Inicio', 
      hasSubmenu: false,
      route: '/home'
    },
    { 
      id: 'transporte', 
      label: 'Transporte', 
      hasSubmenu: true,
      submenuItems: [
        { label: 'Registrar', route: '/home/transporte/registrar' },
        { label: 'Listar', route: '/home/transporte/listar' }
      ]
    },
    { 
      id: 'alimentacion', 
      label: 'Alimentación', 
      hasSubmenu: true, 
      submenuItems: [
        { label: 'Registrar', route: '/home/alimentos/crear' },
        { label: 'Listar', route: '/home/alimentos/listar' }
      ]
    },
    { 
      id: 'progreso', 
      label: 'Progreso', 
      hasSubmenu: true,
      submenuItems: [
        { label: 'Registrar', route: '/progreso/registrar' },
        { label: 'Listar', route: '/progreso/listar' }
      ]
    },
    { 
      id: 'eventos', 
      label: 'Eventos', 
      hasSubmenu: true,
      submenuItems: [
        { label: 'Registrar', route: '/eventos/registrar' },
        { label: 'Listar', route: '/eventos/listar' }
      ]
    },
    { 
      id: 'retos', 
      label: 'Retos', 
      hasSubmenu: true,
      submenuItems: [
        { label: 'Registrar', route: 'home/retos/crear' },
        { label: 'Listar', route: 'home/retos/listar' }
      ]
    },
    { 
      id: 'participaciones', 
      label: 'Participaciones', 
      hasSubmenu: true,
      submenuItems: [
        { label: 'Registrar', route: '/home/participacionretos/crear' },
        { label: 'Listar', route: '/home/participacionretos/listar' }
      ]
    },
    { 
      id: 'recomendacion', 
      label: 'Recomendación', 
      hasSubmenu: true,
      submenuItems: [
        { label: 'Registrar', route: '/recomendacion/registrar' },
        { label: 'Listar', route: '/recomendacion/listar' }
      ]
    },
    { 
      id: 'soporte', 
      label: 'Soporte', 
      hasSubmenu: true,
      submenuItems: [
        { label: 'Registrar', route: '/soporte/registrar' },
        { label: 'Listar', route: '/soporte/listar' }
      ]
    }
  ];

  constructor(private router: Router) {}

  // ---- Métodos propios que ya tenías ----
  irUsuarios() {
    this.router.navigate(['/usuarios']);
  }

  irEvento() {
    this.router.navigate(['/evento']);
  }

  irTransporte() {
    this.router.navigate(['/transportes']);
  }

  // ---- Funciones del nuevo menú ----
  toggleSubmenu(menuId: string): void {
    this.openSubmenu = this.openSubmenu === menuId ? null : menuId;
  }

  isSubmenuOpen(menuId: string): boolean {
    return this.openSubmenu === menuId;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  cerrarSesion(): void {
    console.log('Cerrando sesión...');
    this.router.navigate(['/login']);
  }
}