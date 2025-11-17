FROM php:8.2-fpm AS php

# Install system dependencies
RUN apt-get update && apt-get install -y \
    zip unzip git curl libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy project files
COPY . .

# Install PHP dependencies
RUN composer install --optimize-autoloader --no-interaction

RUN chmod -R 777 storage bootstrap/cache


# ---- NGINX STAGE ----
FROM nginx:alpine AS app

COPY nginx.conf /etc/nginx/nginx.conf

# Copy project from PHP stage
COPY --from=php /var/www/html /var/www/html
