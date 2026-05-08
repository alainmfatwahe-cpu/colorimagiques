FROM node:20-alpine

WORKDIR /app

# ── Backend dependencies ──
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm ci --omit=dev

# ── Frontend build ──
WORKDIR /app
COPY frontend/package*.json ./frontend/
COPY frontend/vite.config.js ./frontend/
COPY frontend/tailwind.config.js ./frontend/
COPY frontend/postcss.config.js ./frontend/
COPY frontend/index.html ./frontend/
COPY frontend/public ./frontend/public
COPY frontend/src ./frontend/src

WORKDIR /app/frontend
RUN npm install && npm run build

# ── Final backend ──
WORKDIR /app
COPY backend/src ./backend/src
COPY backend/uploads ./backend/uploads

# Créer les dossiers d'uploads
RUN mkdir -p backend/uploads/pdfs backend/uploads/images

EXPOSE 4000

CMD sh -c “node backend/src/migrations/run.js && node backend/src/migrations/seed.js && node backend/src/server.js”