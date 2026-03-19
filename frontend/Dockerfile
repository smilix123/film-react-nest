FROM node:20 as builder
WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

# Принудительно устанавливаем проблемный пакет rollup
RUN npm install @rollup/rollup-linux-x64-gnu --no-save || true

COPY . .

RUN npm run build

FROM alpine:latest

RUN mkdir -p /usr/share/nginx/html
COPY --from=builder /app/dist /app-dist

# Копируем собранный фронтенд в общий том. Он используется контейнером nginx.
CMD ["sh", "-c", "cp -r /app-dist/. /usr/share/nginx/html/ && sleep infinity"]
