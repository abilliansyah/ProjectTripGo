# STEP 1: Gunakan image PHP FPM sebagai base image
# Kami menggunakan image PHP FPM resmi yang sudah termasuk PHP dan PHP-FPM
# Ganti '8.2-fpm-alpine' dengan versi PHP yang Anda butuhkan (misalnya 8.1 atau 8.3)
FROM php:8.3-fpm-alpine

# STEP 2: Instal dependensi sistem yang dibutuhkan untuk PHP dan Composer
# Tambahkan ekstensi PHP yang diperlukan oleh Laravel (misalnya pdo, pdo_mysql)
RUN apk add --no-cache \
    curl \
    mysql-client \
    git \
    supervisor \
    # Ekstensi PHP yang umum untuk Laravel
    && docker-php-ext-install pdo pdo_mysql opcache exif pcntl

# STEP 3: Instal Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# STEP 4: Instal Caddy
# Instal Caddy sebagai web server/reverse proxy
RUN apk add --no-cache caddy

# STEP 5: Atur direktori kerja
WORKDIR /app

# STEP 6: Salin semua file proyek Anda ke dalam container
# .dockerignore disarankan untuk mengecualikan node_modules, .git, dll.
COPY . .

# STEP 7: Jalankan Composer Install (Build Process)
# Ini menyelesaikan masalah 'Class Not Found' Anda
RUN composer install --no-dev --optimize-autoloader

# STEP 8: Konfigurasi Caddyfile dan Copy ke lokasi yang benar
# Buat file Caddyfile di root proyek Anda, lalu salin.
# Pastikan Caddyfile Anda memiliki konfigurasi PHP-FPM yang benar.
COPY Caddyfile /etc/caddy/Caddyfile

# STEP 9: Konfigurasi Startup Script (Menggantikan start.sh)
# Karena kita menjalankan 2 proses, kita akan menggunakan Supervisor untuk mengelolanya.
# Tapi untuk lebih sederhana, kita akan buat startup script baru yang menjalankan FPM dan Caddy

# BARIS INI WAJIB: Atur izin eksekusi
RUN chmod +x ./start.sh

# STEP 10: Exposed Port
# Ekspos port yang didengarkan Caddy (Harus 8080 sesuai log Railway)
EXPOSE 8080

# STEP 11: Command Utama (Startup)
# Pastikan Caddy berjalan di foreground dan menggunakan konfigurasi yang kita sediakan
CMD ["./start.sh","caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
# ATAU jika menggunakan start.sh untuk menjalankan FPM dan Caddy:
# CMD ["./start.sh"]