#!/bin/bash
# Wajib: Jalankan PHP-FPM di background
php-fpm -D

# Wajib: Jalankan Caddy di foreground (agar container tetap hidup)
caddy run --config /etc/caddy/Caddyfile --adapter caddyfile