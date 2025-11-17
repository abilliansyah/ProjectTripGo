# Gunakan PHP 8.1 CLI
FROM php:8.1-cli

WORKDIR /var/www/html

# Install ekstensi Laravel yang dibutuhkan
RUN apt-get update && apt-get install -y \
    libzip-dev unzip git curl \
    && docker-php-ext-install pdo_mysql

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Salin semua file project ke container
COPY . .

# Install dependensi composer
RUN composer install --optimize-autoloader --no-dev

# Ekspos port Laravel
EXPOSE 8000

# Jalankan Laravel
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
