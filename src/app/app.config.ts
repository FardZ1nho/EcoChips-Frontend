import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { jwtInterceptor } from './pages/auth/jwt.interceptor';

// 🛑 IMPORTACIÓN DE CORRECCIÓN: provideNoopAnimations anula la dependencia rota
import { provideNoopAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    
    // 🛑 APLICACIÓN DE CORRECCIÓN: Reemplazamos provideAnimationsAsync()
    provideNoopAnimations(),
    
    provideHttpClient(withInterceptors([jwtInterceptor]),withFetch())
  ]
};