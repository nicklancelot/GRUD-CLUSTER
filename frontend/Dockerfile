# ==========================================
# Étape 1 : Compilation de l'application
# ==========================================
FROM node:20-alpine AS build-stage

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Compilation du projet (Génère le dossier /app/dist pour Vite ou /app/build pour CRA)
RUN npm run build

# ==========================================
# Étape 2 : Serveur Web de Production Nginx
# ==========================================
FROM nginx:1.25-alpine

# Copier la configuration personnalisée de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers statiques compilés de l'étape précédente vers le dossier racine de Nginx
# Note : Si vous utilisez Create React App, remplacez dist par build
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Le port standard pour le HTTP en production
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]