# Étape 1 : Build et dépendances de développement
FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .

# Étape 2 : Exécution de production
FROM node:20-alpine
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /usr/src/app ./
# Sécurisation : Utilisation de l'utilisateur non-root natif d'Alpine
USER node
EXPOSE 5000
CMD ["node", "server.js"]