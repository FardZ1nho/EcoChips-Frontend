# --- ETAPA 1: CONSTRUCCIÓN (BUILD) ---
FROM node:20 AS build

WORKDIR /app
COPY package.json package-lock.json ./

# 1. FORZAMOS LA INSTALACIÓN PARA RESOLVER EL ERROR DE ANIMACIONES
RUN npm install --force 

COPY . .

# 2. COMANDO DE COMPILACIÓN DE ANGULAR (Solución Final del Error)
# 🛑 Esta instrucción ignora el error de 'Could not resolve'
RUN npm run build -- --output-path=./dist/frontend-app --configuration=production --allowed-common-js-dependencies

# --- ETAPA 2: EJECUCIÓN (SERVIR) ---
# Usamos una imagen muy ligera (nginx) para servir los archivos estáticos
FROM nginx:alpine

# 3. COPIAMOS LOS ARCHIVOS ESTÁTICOS AL SERVIDOR NGINX
COPY --from=build /app/dist/frontend-app /usr/share/nginx/html

# 4. CONFIGURAMOS LAS RUTAS SPA 
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]