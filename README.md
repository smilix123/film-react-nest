## Film! — деплой через Docker и Docker Compose

#### В репозитории два приложения:

- `frontend` — React/Vite-приложение
- `backend` — Nest.js API (База данных postgres и pgAdmin)

#### Для продакшен-запуска используется связка Docker + Docker Compose:

- отдельные контейнеры для frontend, backend, postgres, pgAdmin и nginx
- `nginx` раздаёт собранный фронтенд и проксирует запросы на бэкенд

### Требования

- Docker
- Docker Compose v2

### Структура Docker-файлов

- `frontend/Dockerfile` — сборка продакшен-версии фронтенда (`npm run build`), результат складывается в volume `frontend_build`
- `backend/Dockerfile` — сборка NestJS в `dist` и запуск продакшен-кода (`node dist/main.js`)
- `nginx/Dockerfile` и `nginx/nginx.conf` — nginx-сервер, раздаёт статику и проксирует `/api/afisha` и `/content/afisha` в бэкенд
- `docker-compose.yml` — оркестрация контейнеров

В `docker-compose.yml` указаны имена образов в реестре `ghcr.io`:

- `ghcr.io/smilix123/film-react-nest-frontend:latest`
- `ghcr.io/smilix123/film-react-nest-backend:latest`
- `ghcr.io/smilix123/film-react-nest-nginx:latest`

При желании вы можете переименовать их под свой GitHub-аккаунт и использовать `docker compose build` + `docker push` для деплоя в GitHub Container Registry.

### Переменные окружения

Бэкенд читает настройки из `.env` (или переменных окружения контейнера).

- `POSTGRES_USER` – имя суперпользователя postgres
- `POSTGRES_PASSWORD` – пароль суперпользователя
- `POSTGRES_DB` – имя базы данных
- `DATABASE_DRIVER` – тип драйвера СУБД (по умолчанию `postgres`)
- `DATABASE_HOST` – хост (по умолчанию `localhost`)
- `DATABASE_PORT` – порт (по умолчанию `5432`)
- `DATABASE_USER` – имя пользователя
- `DATABASE_PASSWORD` – пароль пользователя
- `DATABASE_NAME` – имя базы данных
- `OWNER` – имя пользователя GitHub аккаунта
- `LOGGER_TYPE` – тип логгера (`json`, `tskv`, `dev`; по умолчанию `json`)
- `PORT` – порт (по умолчанию `3000`)
- `PGADMIN_DEFAULT_EMAIL` – логин pgAdmin
- `PGADMIN_DEFAULT_PASSWORD` – пароль pgAdmin

#### Необходимо добавить секреты в настройки репозитория

- `SERVER_HOST` - IP-адрес сервера
- `SERVER_SSH_KEY` - приватный SSH-ключ (~/.ssh/id_rsa)
- `PROJECT_PATH` - путь до проекта на сервере (например, /home/user/app)
- `SERVER_USER` - пользователь (например `root`)

### Запуск через Docker Compose

Из корня репозитория:

```bash
docker compose up -d --build
```

Compose поднимет следующие сервисы:

- `frontend` — сборка фронтенда в volume `frontend_build:/build`
- `backend` — NestJS API, подключён к PostgresDB
- `postgres` — PostgresDB с базой данных
- `pgadmin` — web-интерфейс для PostgresDB (порт `8080`)
- `nginx` — веб-сервер (порт `80`), раздаёт SPA и проксирует API

После запуска будут доступны:

- само приложение: `http://localhost`
- админка базы (pgAdmin): `http://localhost:8080`

Остановить и удалить контейнеры:

```bash
docker compose down
```

# Приложение размещено по адресу:

http://smilix.nomorepartiessite.ru/
