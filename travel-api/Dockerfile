FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    zip unzip git curl libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# 1. Copy composer info ONLY
COPY composer.json composer.lock ./

# 2. Install deps WITHOUT artisan
RUN composer install --no-scripts --optimize-autoloader --no-interaction

# 3. Copy all project files (BUT do NOT overwrite vendor)
COPY . .

# 4. Permissions
RUN chmod -R 775 storage bootstrap/cache

ENV PORT=8080
EXPOSE 8080

# cek vendor
RUN ls -R /var/www/html/vendor > /vendor_contents.txt || true

CMD cat /vendor_contents.txt && php -S 0.0.0.0:${PORT} -t public

