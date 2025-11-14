FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    zip unzip git curl libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy composer first
COPY composer.json composer.lock ./

# Install PHP dependencies (disable auto scripts)
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts

# Copy all project files
COPY . .

# Run package discovery AFTER files copied
RUN php artisan package:discover --ansi || true

# Ensure storage & cache writeable
RUN chmod -R 775 storage bootstrap/cache

# Railway uses dynamic port
ENV PORT=8000
EXPOSE 8000

# Run Laravel using PHP built-in webserver (lebih aman dari artisan serve)
CMD php -S 0.0.0.0:${PORT} -t public
