FROM php:8.2-fpm

# Install extensions
RUN apt-get update && apt-get install -y \
    zip unzip git curl libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring bcmath gd

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy composer files
COPY composer.json composer.lock ./

# Install dependencies (disable auto-discovery)
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts

# Copy rest of project
COPY . .

# Discover packages manually (abaikan error)
RUN php artisan package:discover --ansi || true

# Fix folder permissions
RUN chmod -R 775 storage bootstrap/cache

EXPOSE 8000

# USE PHP BUILT-IN SERVER INSTEAD OF ARTISAN SERVE
CMD php -S 0.0.0.0:${PORT} -t public
