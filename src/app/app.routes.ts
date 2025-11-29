import { Routes } from '@angular/router';
import { Login } from './pages/auth/login/login';
import { Registro } from './pages/auth/registro/registro';
import { Landing } from './pages/landing/landing';

// IMPORTAR EL GUARD
import { AuthGuard } from './guards/auth-guard'; 

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
import { RecomendacionTipoCountDTO } from './models/RecomendacionTipoCountDTO';
import { UsuarioRecomendacionListar } from './components/usuariorecomendacion/usuariorecomendacionlistar/usuariorecomendacionlistar';
import { UsuarioRecomendacionCrear } from './components/usuariorecomendacion/usuariorecomendacioncrear/usuariorecomendacioncrear';
import { ListarPorUsuarioComponent } from './components/usuariorecomendacion/listarporusuario/listarporusuario';



export const routes: Routes = [
    { path: '', component: Landing },
    { path: 'login', component: Login },
    { path: 'registro', component: Registro },

    // HOME + SUBMENÚS (Protegido con canActivate)
    { 
        path: 'home', 
        component: Home,
        canActivate: [AuthGuard], // <--- ¡AQUÍ ESTÁ LA MAGIA! Si el Guard dice false, no entras.
        children: [
            { path: '', component: HomeDashboard },

            { path: 'reportes', component: Reportes },

            // --- RETOS ---
            { path: 'retos/listar', component: Retolistar },
            { path: 'retos/crear', component: Retocrear },
            { path: 'retos/editar/:id', component: Retocrear },
            
            // --- PARTICIPACION ---
            { path: 'participacionretos/listar', component: ParticipacionRetoListar },
            { path: 'participacionretos/crear', component: ParticipacionRetoCrear },
            { path: 'participacionretos/editar/:id', component: ParticipacionRetoCrear },

            // --- EVENTOS ---
            { path: 'eventos/listar', component: EventoListar},
            { path: 'eventos/crear', component: EventoCrear},
            { path: 'eventos/editar/:id', component: EventoCrear},

            { path: 'registroeventos/listar', component: RegistroEventoListar},
            { path: 'registroeventos/crear', component: RegistroEventoCrear},
            { path: 'registroeventos/editar/:id', component: RegistroEventoCrear},

            { path: 'usuarios/listar', component: Usuariolistar },
            { path: 'usuarios/crear', component: UsuarioCrear },

            { path: 'transporte/listar', component: Transportelistar },
            { path: 'transporte/registrar', component: Transporteinsertar },
            { path: 'transporte/actualizar/:id', component: Transporteinsertar },

            { path: 'registrostransporte/listar', component: RegistroTransporteListar },
            { path: 'registrostransporte/insertar', component: RegistroTransporteInsertar }, 
            { path: 'registrostransporte/editar/:id', component: RegistroTransporteInsertar },

            { path: 'registrosalimentacion/listar', component: Registroalimentacionlistar },
            { path: 'registrosalimentacion/insertar', component: Registroalimentacioninsertar },
            { path: 'registrosalimentacion/editar/:id', component: Registroalimentacioninsertar },

            { path: 'alimentos/listar', component: Alimentolistar },
            { path: 'alimentos/crear', component: Alimentocrear },
            { path: 'alimentos/editar/:id', component: Alimentocrear },

            { path: 'recompensas/listar', component: Recompensalistar },
            { path: 'recompensas/crear', component: Recompensacrear },
            { path: 'recompensas/editar/:id', component: Recompensacrear },

            { path: 'soportesolicitudes/listar', component: SoporteSolicitudListar },
            { path: 'soportesolicitudes/crear', component: SoporteSolicitudInsertar },
            { path: 'soportesolicitudes/editar/:id', component: SoporteSolicitudInsertar },

            { path: 'reportes/populares', component: ReporteRetosPopulares},
            { path: 'reportes/top-usuarios', component: ReportePrTopUsuarios},
            { path: 'reportes/top5-contaminantes', component: ReporteTransporteImpacto},
            { path: 'reportes/promedio-co2-tipo', component: ReporteAlimentoCO2},

            { path: 'recomendaciones/listar', component: RecomendacionListar},
            { path: 'recomendaciones/crear', component: RecomendacionCrear},
            { path: 'recomendaciones/editar/:id', component: RecomendacionCrear},

            { path: 'progreso/registrar', component: ProgresoCrear },
            { path: 'progreso/listar', component: ProgresoListar },
            { path: 'progreso/editar/:id', component: ProgresoCrear },

            { path: 'reportes/por-tipo', component: ReporteRecoPrTipo},

            { path: 'usuariorecomendacion/listar', component: UsuarioRecomendacionListar },
            { path: 'usuariorecomendacion/crear', component: UsuarioRecomendacionCrear },
            { path: 'usuariorecomendacion/editar/:id', component: UsuarioRecomendacionCrear },
            { path: 'usuariorecomendacion/buscar', component: ListarPorUsuarioComponent },
        ]
    },
];