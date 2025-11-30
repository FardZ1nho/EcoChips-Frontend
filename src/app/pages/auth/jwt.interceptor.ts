import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Obtenemos el token del almacenamiento local
  const token = localStorage.getItem('token');

  // 2. Si existe el token, clonamos la petición y le añadimos el header de autorización
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    // Pasamos la petición clonada (con token) al siguiente paso
    return next(clonedRequest);
  }

  // 3. Si no hay token, pasamos la petición original tal cual
  return next(req);
};