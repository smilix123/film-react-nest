FROM node:20 AS builder
WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

# Принудительно устанавливаем проблемный пакет rollup
RUN npm install @rollup/rollup-linux-x64-gnu --no-save || true

COPY . .

RUN npm run build

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/dist ./dist

RUN mkdir -p /build/content

CMD sh -c "cp -rp /app/dist/. /build/ && echo 'Билд в томе' && sleep infinity"