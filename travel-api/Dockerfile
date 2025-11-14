# STEP 1: Gunakan image PHP FPM sebagai base image
FROM php:8.3-fpm-alpine

# STEP 2: Instal dependensi sistem yang dibutuhkan
RUN apk update && apk add --no-cache \
    curl \
    mysql-client \
    git \
    caddy \
    supervisor \
    # Dependensi build untuk ekstensi PHP
    $PHPIZE_DEPS \
    # Tambahkan user www-data untuk izin file
    && adduser -D -g 'www-data' www-data

# STEP 2b: Instal ekstensi PHP (docker-php-ext-install)
# Memisahkan ini dari langkah 'apk add' membantu isolasi masalah build.
RUN docker-php-ext-install pdo pdo_mysql opcache exif pcntl

# STEP 3: Instal Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# STEP 4: Atur direktori kerja
WORKDIR /app

# STEP 5: Salin start.sh secara eksplisit (PENTING untuk mengatasi 'not found')
# Salin start.sh DULU sebelum menyalin seluruh proyek
COPY start.sh /app/start.sh 

# Wajib: Atur izin eksekusi (Mengatasi 'Permission denied')
RUN chmod +x /app/start.sh 

# STEP 6: Salin sisa semua file proyek Anda ke dalam container
COPY . .

# STEP 7: Jalankan Composer Install (Build Process)
RUN composer install --no-dev --optimize-autoloader

# STEP 8: Konfigurasi Caddyfile dan Copy ke lokasi yang benar
# Menyalin Caddyfile setelah composer agar file vendor/ sudah ada jika diperlukan
COPY Caddyfile /etc/caddy/Caddyfile

# STEP 9: Exposed Port
EXPOSE 8080

# STEP 10: Command Utama (Startup)
# Jalankan skrip startup menggunakan path absolut
CMD ["/app/start.sh"]