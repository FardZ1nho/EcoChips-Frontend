# --- ETAPA 1: CONSTRUCCIÓN (BUILD) ---
# Usamos Node para instalar dependencias y Angular CLI para el build
FROM node:20 AS build

WORKDIR /app
COPY package.json package-lock.json ./

# 1. FORZAMOS LA INSTALACIÓN PARA RESOLVER EL ERROR DE ANIMACIONES
RUN npm install --force 

COPY . .

# 2. COMANDO DE COMPILACIÓN DE ANGULAR (crea la carpeta dist/frontend-app)
# Output path debe coincidir con tu angular.json: dist/frontend-app
RUN npm run build -- --output-path=./dist/frontend-app --configuration=production

# --- ETAPA 2: EJECUCIÓN (SERVIR) ---
# Usamos una imagen muy ligera (nginx) para servir los archivos estáticos
FROM nginx:alpine

# 3. COPIAMOS LOS ARCHIVOS ESTÁTICOS AL SERVIDOR NGINX
COPY --from=build /app/dist/frontend-app /usr/share/nginx/html

# 4. CONFIGURAMOS LAS RUTAS SPA (PARA QUE /DASHBOARD FUNCIONE)
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]