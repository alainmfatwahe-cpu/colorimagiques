FROM node:20-alpine

WORKDIR /app

# Backend dependencies
COPY backend/package*.json ./backend/
RUN mkdir -p ./backend && cd ./backend && npm ci --omit=dev

# Frontend files
COPY frontend/package*.json ./frontend/
COPY frontend/vite.config.js ./frontend/
COPY frontend/tailwind.config.js ./frontend/
COPY frontend/postcss.config.js ./frontend/
COPY frontend/index.html ./frontend/
COPY frontend/public ./frontend/public
COPY frontend/src ./frontend/src

# Build frontend
WORKDIR /app/frontend
RUN npm install && npm run build

# Final setup
WORKDIR /app
COPY backend/src ./backend/src
RUN mkdir -p ./backend/uploads/pdfs ./backend/uploads/images

EXPOSE 8080

CMD sh -c 'node backend/src/migrations/run.js && node backend/src/migrations/seed.js && node backend/src/server.js'
