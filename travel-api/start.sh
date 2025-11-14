#!/bin/bash
# 1. Jalankan PHP-FPM di background pada Port 9000
echo "Starting PHP-FPM..."
php-fpm -D

# 2. Jalankan Caddy di foreground (Wajib agar container tetap hidup)
echo "Starting Caddy on :8080..."
# Pastikan Caddyfile Anda telah disalin ke lokasi ini oleh Dockerfile
caddy run --config /etc/caddy/Caddyfile --adapter caddyfile