# -----------------------------------------
# PHP-FPM IMAGE
# -----------------------------------------
FROM php:8.2-fpm AS php

RUN apt-get update && apt-get install -y \
    git zip unzip curl libpng-dev libonig-dev libxml2-dev libzip-dev \
    && docker-php-ext-install pdo pdo_mysql zip mbstring exif pcntl bcmath gd

# Install composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

RUN composer install --no-dev --optimize-autoloader --no-interaction

RUN chmod -R 775 storage bootstrap/cache

# -----------------------------------------
# NGINX IMAGE
# -----------------------------------------
FROM nginx:alpine AS app

COPY --from=php /var/www/html /var/www/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /var/www/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
