import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/authservice';

// Interfaces para definir la estructura del menú
interface SubMenuItem {
  label: string;
  route: string;
}

interface MenuItem {
  id: string;
  label: string;
  hasSubmenu: boolean;
  submenuItems?: (SubMenuItem | MenuItemNested)[];
  route?: string;
}

interface MenuItemNested {
  label: string;
  hasSubmenu: boolean;
  submenuItems?: SubMenuItem[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  openSubmenu: string | null = null;
  openNestedSubmenu: string | null = null;

  // ✅ PROPIEDADES EXISTENTES
  nombreUsuario: string = 'Usuario';
  tipoUsuario: string = 'USER';
  esAdmin: boolean = false;

  // 🆕 NUEVA PROPIEDAD PARA COMPLETAR PERFIL
  perfilCompleto: boolean = false;

  // --- TU ESTRUCTURA DE MENÚ ---
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
        { label: 'Registrar', route: '/home/progreso/registrar' },
        { label: 'Listar', route: '/home/progreso/listar' }
      ]
    },
    { 
      id: 'eventos', 
      label: 'Eventos', 
      hasSubmenu: true, 
      submenuItems: [
        { label: 'Registrar', route: '/home/eventos/crear' },
        { label: 'Listar', route: '/home/eventos/listar' }
      ]
    },
    { 
      id: 'registroeventos', 
      label: 'Registros', 
      hasSubmenu: true,
      submenuItems: [
        { label: 'Registrar Evento - Usuario', route: '/home/registroeventos/crear' },
        { label: 'Listar Evento - Usuario', route: '/home/registroeventos/listar' },
        { label: 'Registrar uso de Transporte', route: '/home/registrostransporte/insertar' },
        { label: 'Listar Transporte - Usuario', route: '/home/registrostransporte/listar' },
        { label: 'Historial Transporte por Usuario', route: '/home/registrostransporte/buscar' },
        { label: 'Registrar consumo de Alimento', route: '/home/registrosalimentacion/insertar' },
        { label: 'Listar Alimento - Usuario', route: '/home/registrosalimentacion/listar' },
        { label: 'Historial Alimentación por Usuario', route: '/home/registrosalimentacion/buscar' },
      ]
    },
    { 
      id: 'retos', 
      label: 'Retos', 
      hasSubmenu: true,
      submenuItems: [
        { label: 'Registrar', route: '/home/retos/crear' },
        { label: 'Listar', route: '/home/retos/listar' }
      ]
    },
    { 
      id: 'recompensa', 
      label: 'Recompensas', 
      hasSubmenu: true,
      submenuItems: [
        { label: 'Registrar', route: '/home/recompensas/crear' },
        { label: 'Listar', route: '/home/recompensas/listar' }, 
        { label: 'Canjear', route: '/home/usuariorecompensa/crear' },
        { label: 'Listar Canjes', route: '/home/usuariorecompensa/listar' },
        { label: 'Historial de Canjes por Usuario', route: '/home/usuariorecompensa/buscar' },
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
        { label: 'Registrar', route: '/home/recomendaciones/crear' },
        { label: 'Listar', route: '/home/recomendaciones/listar' },
        { label: 'Registrar Usuario-Recomendación', route: '/home/usuariorecomendacion/crear' },
        { label: 'Listar Usuario-Recomendación', route: '/home/usuariorecomendaciones/listar' },
        { label: 'Listar Recomendaciones por Usuario', route: '/home/usuariorecomendacion/buscar' }
      ]
    },
    { 
      id: 'reportes', 
      label: 'Reportes', 
      hasSubmenu: false,
      route: '/home/reportes'
    },
    { 
      id: 'soporte', 
      label: 'Soporte', 
      hasSubmenu: true,
      submenuItems: [
        {
          label: 'Solicitud',
          hasSubmenu: true,
          submenuItems: [
            { label: 'Registrar Solicitud', route: '/home/soportesolicitudes/crear' },
            { label: 'Listar Solicitudes', route: '/home/soportesolicitudes/listar' }
          ]
        },
        {
          // ✅ SECCIÓN RESPUESTA MODIFICADA
          label: 'Respuesta',
          hasSubmenu: true,
          submenuItems: [
            { label: 'Ver Solicitudes', route: '/home/soportesolicitudes/listar' }
          ]
        }
      ]
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService 
  ) {}

  ngOnInit(): void {
    this.cargarInfoUsuario();
    this.verificarPerfilCompleto();
  }

  cargarInfoUsuario(): void {
    const usuario = this.authService.getUsuarioActual();
    
    if (usuario) {
      this.nombreUsuario = usuario.nombre || 'Usuario';
      console.log('👤 Usuario cargado:', this.nombreUsuario);
    }

    const tipo = this.authService.getTipoUsuario();
    if (tipo) {
      this.tipoUsuario = tipo;
      this.esAdmin = tipo === 'ADMIN';
      
      console.log('🔑 Tipo de usuario:', this.tipoUsuario);
      console.log('👑 Es Admin:', this.esAdmin);
    }
  }

  verificarPerfilCompleto(): void {
    this.perfilCompleto = this.authService.isPerfilCompleto();
    console.log('🔍 Perfil completo:', this.perfilCompleto);
  }

  irACompletarPerfil(): void {
    console.log('🎯 Navegando a completar perfil');
    this.router.navigate(['/home/completar-perfil']);
  }

  irUsuarios() {
    this.router.navigate(['/usuarios']);
  }

  irEvento() {
    this.router.navigate(['/evento']);
  }

  irTransporte() {
    this.router.navigate(['/transportes']);
  }

  toggleSubmenu(menuId: string): void {
    this.openSubmenu = this.openSubmenu === menuId ? null : menuId;
    if (this.openSubmenu !== menuId) {
      this.openNestedSubmenu = null;
    }
  }

  toggleNestedSubmenu(nestedId: string, event: Event): void {
    event.stopPropagation();
    this.openNestedSubmenu = this.openNestedSubmenu === nestedId ? null : nestedId;
  }

  isSubmenuOpen(menuId: string): boolean {
    return this.openSubmenu === menuId;
  }

  isNestedSubmenuOpen(nestedId: string): boolean {
    return this.openNestedSubmenu === nestedId;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  isNestedMenu(item: any): item is MenuItemNested {
    return item.hasSubmenu !== undefined;
  }

  getRoute(item: SubMenuItem | MenuItemNested): string {
    return 'route' in item ? item.route : '';
  }

  cerrarSesion(): void {
    console.log('🚪 Cerrando sesión...');
    this.authService.logout();
  }
}