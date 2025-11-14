#!/bin/bash
composer install
php artisan migrate --force
php artisan serve --host=0.0.0.0 --port=$PORT
/usr/sbin/php-fpm &
# 2. Tunggu sebentar agar PHP-FPM sempat berjalan (opsional, tapi disarankan)
sleep 5
# 3. Jalankan Caddy di foreground (Wajib: proses utama harus di foreground)
# Caddy akan melayani permintaan di Port 8080 dan meneruskannya ke PHP-FPM
caddy run --config /etc/Caddyfile --adapter caddyfile --watch