FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    zip unzip git curl libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy composer first (best practice)
COPY composer.json composer.lock ./

# Install ALL deps (NO --no-dev)
RUN composer install --optimize-autoloader --no-interaction

# Copy full project
COPY . .

# Ensure permissions
RUN chmod -R 775 storage bootstrap/cache

# Build Laravel caches (optional)
RUN php artisan config:cache || true
RUN php artisan route:cache || true

ENV PORT=8000
EXPOSE 8000

CMD php -S 0.0.0.0:${PORT} -t public
