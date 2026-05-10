FROM node:20-alpine AS builder

WORKDIR /app

# Frontend build
COPY frontend/package*.json ./frontend/
COPY frontend/vite.config.js ./frontend/
COPY frontend/tailwind.config.js ./frontend/
COPY frontend/postcss.config.js ./frontend/
COPY frontend/index.html ./frontend/
COPY frontend/public ./frontend/public
COPY frontend/src ./frontend/src
WORKDIR /app/frontend
RUN npm install && npm run build

# Backend setup
WORKDIR /app
COPY backend/package*.json ./backend/
RUN mkdir -p ./backend && cd ./backend && npm ci --omit=dev
COPY backend/src ./backend/src
RUN mkdir -p ./backend/uploads/pdfs ./backend/uploads/images

# Nginx stage
FROM nginx:alpine
COPY --from=builder /app/frontend/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
RUN echo -e 'server {\n    listen 8080;\n    root /usr/share/nginx/html;\n    index index.html;\n    location / {\n        try_files $uri $uri/ /index.html;\n    }\n    location /api/ {\n        proxy_pass http://localhost:8081/api/;\n        proxy_http_version 1.1;\n        proxy_set_header Upgrade $http_upgrade;\n        proxy_set_header Connection upgrade;\n        proxy_set_header Host $host;\n        proxy_cache_bypass $http_upgrade;\n    }\n}' > /etc/nginx/conf.d/default.conf

# Start nginx + backend
COPY --from=builder /app/backend /app/backend
CMD sh -c 'node /app/backend/src/migrations/run.js && node /app/backend/src/migrations/seed.js && node /app/backend/src/server.js' & nginx -g 'daemon off;'