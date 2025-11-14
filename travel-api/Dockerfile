FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    zip unzip git curl libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy composer files
COPY composer.json composer.lock ./

# Install PHP dependencies (tanpa artisan discover)
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts

# Copy all project files
COPY . .

# Setelah semua file ada → jalankan artisan discover
RUN php artisan package:discover --ansi || true

# Set permission folder laravel
RUN chmod -R 775 storage bootstrap/cache

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=${PORT}"]
