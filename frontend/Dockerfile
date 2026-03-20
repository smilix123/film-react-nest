# Этап 1: Сборка
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Принудительно устанавливаем проблемный пакет rollup
RUN npm install @rollup/rollup-linux-x64-gnu --no-save || true

COPY . .
RUN npm run build

# Этап 2: Подготовка данных для Volume
FROM alpine:latest
WORKDIR /app
COPY --from=build /app/dist ./dist

# Копируем файлы в Volume при старте и оставляем контейнер "висеть"
CMD sh -c "cp -rp /app/dist/. /usr/share/nginx/html/ && sleep infinity"