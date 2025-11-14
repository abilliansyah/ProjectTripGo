# 1. Base PHP image
FROM php:8.2-fpm

# 2. Install extensions
RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    curl

# 3. Install required PHP extensions
RUN docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd

# 4. Install Composer
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

# 5. Set working directory
WORKDIR /var/www/html

# 6. Copy all project files
COPY . .

# 7. Install dependencies
RUN composer install --no-dev --optimize-autoloader

# 9. Expose port
EXPOSE 8000

# 10. Start Laravel server using $PORT
CMD php artisan serve --host=0.0.0.0 --port=${PORT}
