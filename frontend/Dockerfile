FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci
RUN npm i @rollup/rollup-linux-x64-musl --no-save

COPY . .
RUN npm run build

VOLUME ["/app/dist"]