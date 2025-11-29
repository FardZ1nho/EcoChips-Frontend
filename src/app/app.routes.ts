import { Routes } from '@angular/router';
import { Login } from './pages/auth/login/login';
import { Registro } from './pages/auth/registro/registro';
import { Landing } from './pages/landing/landing';

// ✅ GUARDS ACTUALIZADOS
import { AuthGuard } from './guards/auth-guard'; 
import { AdminGuard } from './guards/admin-guard'; 
import { UserGuard } from './guards/user-guard'; 

import { Usuariolistar } from './components/usuario/usuariolistar/usuariolistar';
import { UsuarioCrear } from './components/usuario/usuariocrear/usuariocrear';

import { Home } from './pages/home/home';
import { HomeDashboard } from './components/dashboard/home-dashboard';

import { Transportelistar } from './components/transporte/transportelistar/transportelistar';
import { Transporteinsertar } from './components/transporte/transporteinsertar/transporteinsertar';

import { Retolistar } from './components/reto/retolistar/retolistar';
import { Retocrear } from './components/reto/retocrear/retocrear';
import { ParticipacionRetoListar } from './components/participacionreto/participacionretolistar/participacionretolistar';
import { ParticipacionRetoCrear } from './components/participacionreto/participacionretocrear/participacionretocrear';
import { EventoListar } from './components/evento/eventolistar/eventolistar';
import { EventoCrear } from './components/evento/eventocrear/eventocrear';
import { RegistroEventoListar } from './components/registroevento/registroeventolistar/registroeventolistar';
import { RegistroEventoCrear } from './components/registroevento/registroeventocrear/registroeventocrear';
import { RegistroTransporteListar } from './components/registrotransporte/registrotransportelistar/registrotransportelistar';
import { RegistroTransporteInsertar } from './components/registrotransporte/registrotransporteinsertar/registrotransporteinsertar';
import { Alimentolistar } from './components/alimento/alimentolistar/alimentolistar';
import { Alimentocrear } from './components/alimento/alimentocrear/alimentocrear';
import { Recompensalistar } from './components/recompensa/recompensalistar/recompensalistar';
import { Recompensacrear } from './components/recompensa/recompensacrear/recompensacrear';

import { Registroalimentacionlistar } from './components/registroalimentacion/registroalimentacionlistar/registroalimentacionlistar';
import { Registroalimentacioninsertar } from './components/registroalimentacion/registroalimentacioninsertar/registroalimentacioninsertar';

import { SoporteSolicitudInsertar } from './components/soportesolicitud/soportesolicitudinsertar/soportesolicitudinsertar';
import { SoporteSolicitudListar } from './components/soportesolicitud/soportesolicitudlistar/soportesolicitudlistar';

import { Reportes } from './components/reportes/reportes';
import { ReporteRetosPopulares } from './components/reporteRetosPopulares/reporteRetosPopulares';
import { ReportePrTopUsuarios } from './components/reportePrTopUsuarios/reportePrTopUsuarios';
import { ReporteTransporteImpacto } from './components/reporte-transporte-impacto/reporte-transporte-impacto';
import { ReporteAlimentoCO2 } from './components/reporte-alimento-co2/reporte-alimento-co2';
import { ProgresoCrear } from './components/progreso/progresocrear/progresocrear';
import { ProgresoListar } from './components/progreso/progresolistar/progresolistar';

import { RecomendacionCrear } from './components/recomendacion/recomendacioncrear/recomendacioncrear';
import { RecomendacionListar } from './components/recomendacion/recomendacionlistar/recomendacionlistar';

import { ReporteRecoPrTipo } from './components/reporteRecomendacionesPorTipo/reporteRecoPrTipo';
import { UsuarioRecomendacionListar } from './components/usuariorecomendacion/usuariorecomendacionlistar/usuariorecomendacionlistar';
import { UsuarioRecomendacionCrear } from './components/usuariorecomendacion/usuariorecomendacioncrear/usuariorecomendacioncrear';
import { ListarPorUsuarioComponent } from './components/usuariorecomendacion/listarporusuario/listarporusuario';

export const routes: Routes = [
    // 🌍 RUTAS PÚBLICAS (Sin autenticación)
    { path: '', component: Landing },
    { path: 'login', component: Login },
    { path: 'registro', component: Registro },

    // 🏠 HOME + SUBMENÚS (Protegido con AuthGuard base)
    { 
        path: 'home', 
        component: Home,
        canActivate: [AuthGuard], // ✅ Verifica que esté autenticado
        children: [
            { path: '', component: HomeDashboard },

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // 👨‍💼 RUTAS SOLO PARA ADMINISTRADORES
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            
            // --- USUARIOS (Solo Admin) ---
            { path: 'usuarios/listar', component: Usuariolistar, canActivate: [AdminGuard] },
            { path: 'usuarios/crear', component: UsuarioCrear, canActivate: [AdminGuard] },

            // --- TRANSPORTES (Solo Admin puede crear/editar) ---
            { path: 'transporte/listar', component: Transportelistar, canActivate: [AdminGuard] },
            { path: 'transporte/registrar', component: Transporteinsertar, canActivate: [AdminGuard] },
            { path: 'transporte/actualizar/:id', component: Transporteinsertar, canActivate: [AdminGuard] },

            // --- ALIMENTOS (Solo Admin) ---
            { path: 'alimentos/listar', component: Alimentolistar, canActivate: [AdminGuard] },
            { path: 'alimentos/crear', component: Alimentocrear, canActivate: [AdminGuard] },
            { path: 'alimentos/editar/:id', component: Alimentocrear, canActivate: [AdminGuard] },

            // --- RECOMPENSAS (Solo Admin) ---
            { path: 'recompensas/listar', component: Recompensalistar, canActivate: [AdminGuard] },
            { path: 'recompensas/crear', component: Recompensacrear, canActivate: [AdminGuard] },
            { path: 'recompensas/editar/:id', component: Recompensacrear, canActivate: [AdminGuard] },

            // --- REPORTES (Solo Admin) ---
            { path: 'reportes', component: Reportes, canActivate: [AdminGuard] },
            { path: 'reportes/populares', component: ReporteRetosPopulares, canActivate: [AdminGuard] },
            { path: 'reportes/top-usuarios', component: ReportePrTopUsuarios, canActivate: [AdminGuard] },
            { path: 'reportes/top5-contaminantes', component: ReporteTransporteImpacto, canActivate: [AdminGuard] },
            { path: 'reportes/promedio-co2-tipo', component: ReporteAlimentoCO2, canActivate: [AdminGuard] },
            { path: 'reportes/por-tipo', component: ReporteRecoPrTipo, canActivate: [AdminGuard] },

            // --- RECOMENDACIONES (Solo Admin) ---
            { path: 'recomendaciones/listar', component: RecomendacionListar, canActivate: [AdminGuard] },
            { path: 'recomendaciones/crear', component: RecomendacionCrear, canActivate: [AdminGuard] },
            { path: 'recomendaciones/editar/:id', component: RecomendacionCrear, canActivate: [AdminGuard] },

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            // 👤 RUTAS SOLO PARA USUARIOS NORMALES
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

            // --- RETOS (Solo User puede participar) ---
            { path: 'retos/listar', component: Retolistar, canActivate: [UserGuard] },
            { path: 'retos/crear', component: Retocrear, canActivate: [UserGuard] },
            { path: 'retos/editar/:id', component: Retocrear, canActivate: [UserGuard] },
            
            // --- PARTICIPACIÓN (Solo User) ---
            { path: 'participacionretos/listar', component: ParticipacionRetoListar, canActivate: [UserGuard] },
            { path: 'participacionretos/crear', component: ParticipacionRetoCrear, canActivate: [UserGuard] },
            { path: 'participacionretos/editar/:id', component: ParticipacionRetoCrear, canActivate: [UserGuard] },

            // --- EVENTOS (Solo User) ---
            { path: 'eventos/listar', component: EventoListar, canActivate: [UserGuard] },
            { path: 'eventos/crear', component: EventoCrear, canActivate: [UserGuard] },
            { path: 'eventos/editar/:id', component: EventoCrear, canActivate: [UserGuard] },

            { path: 'registroeventos/listar', component: RegistroEventoListar, canActivate: [UserGuard] },
            { path: 'registroeventos/crear', component: RegistroEventoCrear, canActivate: [UserGuard] },
            { path: 'registroeventos/editar/:id', component: RegistroEventoCrear, canActivate: [UserGuard] },

            // --- REGISTRO TRANSPORTE (Solo User) ---
            { path: 'registrostransporte/listar', component: RegistroTransporteListar, canActivate: [UserGuard] },
            { path: 'registrostransporte/insertar', component: RegistroTransporteInsertar, canActivate: [UserGuard] }, 
            { path: 'registrostransporte/editar/:id', component: RegistroTransporteInsertar, canActivate: [UserGuard] },

            // --- REGISTRO ALIMENTACIÓN (Solo User) ---
            { path: 'registrosalimentacion/listar', component: Registroalimentacionlistar, canActivate: [UserGuard] },
            { path: 'registrosalimentacion/insertar', component: Registroalimentacioninsertar, canActivate: [UserGuard] },
            { path: 'registrosalimentacion/editar/:id', component: Registroalimentacioninsertar, canActivate: [UserGuard] },

            // --- SOPORTE (Solo User) ---
            { path: 'soportesolicitudes/listar', component: SoporteSolicitudListar, canActivate: [UserGuard] },
            { path: 'soportesolicitudes/crear', component: SoporteSolicitudInsertar, canActivate: [UserGuard] },
            { path: 'soportesolicitudes/editar/:id', component: SoporteSolicitudInsertar, canActivate: [UserGuard] },

            // --- PROGRESO (Solo User) ---
            { path: 'progreso/registrar', component: ProgresoCrear, canActivate: [UserGuard] },
            { path: 'progreso/listar', component: ProgresoListar, canActivate: [UserGuard] },
            { path: 'progreso/editar/:id', component: ProgresoCrear, canActivate: [UserGuard] },

            // --- USUARIO RECOMENDACIÓN (Solo User) ---
            { path: 'usuariorecomendacion/listar', component: UsuarioRecomendacionListar, canActivate: [UserGuard] },
            { path: 'usuariorecomendacion/crear', component: UsuarioRecomendacionCrear, canActivate: [UserGuard] },
            { path: 'usuariorecomendacion/editar/:id', component: UsuarioRecomendacionCrear, canActivate: [UserGuard] },
            { path: 'usuariorecomendacion/buscar', component: ListarPorUsuarioComponent, canActivate: [UserGuard] },
        ]
    },
];