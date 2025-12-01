# --- ETAPA 1: CONSTRUCCIÓN (BUILD) ---
FROM node:20 AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --legacy-peer-deps

RUN npm install @angular/animations --legacy-peer-deps || true

COPY . .

RUN npm run build -- --output-path=./dist/frontend-app --configuration=production

# --- ETAPA 2: NGINX ---
FROM nginx:alpine

# ⭐ CAMBIO AQUÍ: Agrega /browser al final
COPY --from=build /app/dist/frontend-app/browser /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]