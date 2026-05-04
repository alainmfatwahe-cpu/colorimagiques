FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY . .

# Créer les dossiers d'uploads
RUN mkdir -p uploads/pdfs uploads/images

EXPOSE 4000

# Lancer les migrations puis démarrer le serveur
CMD ["sh", "-c", "node src/migrations/run.js && node src/migrations/seed.js && node src/server.js"]
