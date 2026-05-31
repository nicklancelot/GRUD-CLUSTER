# Image Node
FROM node:20

# Dossier de travail
WORKDIR /app

# Copier package.json
COPY package*.json ./

# Installer dépendances
RUN npm install

# Copier le reste
COPY . .

# Port du backend
EXPOSE 5000

# Lancer le serveur
CMD ["npm", "start"]
