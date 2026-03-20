FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Копируем статику бэкенда в образ
COPY ./backend/public/content /usr/share/nginx/html/content

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]