# 🚀 ProjectTripGo - Aplikasi Pemesanan Tiket Travel

Selamat datang di repositori ProjectTripGo! Proyek ini adalah aplikasi pemesanan tiket travel *full-stack* yang dibangun menggunakan Laravel untuk backend API dan Next.js untuk frontend.

Repositori ini menggunakan struktur **monorepo**, yang berarti kode backend dan frontend berada dalam satu repositori yang sama untuk memudahkan pengelolaan.

* `travel-api/`: Folder project Backend (Laravel).
* `travel-web/`: Folder project Frontend (Next.js).

##  Teknologi yang Digunakan

* **Backend (`travel-api`)**:
    * [Laravel](https://laravel.com/)
    * [Laravel Sanctum](https://laravel.com/docs/sanctum) (Untuk Autentikasi API)
    * Database: MySQL (atau sesuai konfigurasi Anda)
* **Frontend (`travel-web`)**:
    * [Next.js](https://nextjs.org/) (Menggunakan App Router)
    * [React](https://reactjs.org/)
    * [Tailwind CSS](https://tailwindcss.com/) (Dapat diasumsikan)

---

## 🛠️ Panduan Instalasi & Setup (Untuk Kolaborator)

Untuk menjalankan proyek ini di komputer Anda, Anda harus menjalankan **dua server** secara bersamaan: satu untuk Backend (API) dan satu untuk Frontend (Website).

Ikuti langkah-langkah ini:

### 1. Setup Backend (Laravel API)

Backend akan berjalan di `http://127.0.0.1:8000`.

1.  **Buka terminal baru** dan masuk ke folder API:
    ```bash
    cd travel-api
    ```

2.  Install dependensi PHP (Composer):
    ```bash
    composer install
    ```

3.  Buat file `.env` Anda. (File ini berisi *password* database dan *key* rahasia, jadi tidak di-upload ke GitHub).
    ```bash
    cp .env.example .env
    ```

4.  Buat *database* baru di MySQL (misalnya `tripgo_db`).

5.  Konfigurasi file `.env` Anda. Sesuaikan baris `DB_` dengan nama database, *username*, dan *password* Anda:
    ```
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=tripgo_db
    DB_USERNAME=root
    DB_PASSWORD=
    ```

6.  Generate *key* aplikasi Laravel:
    ```bash
    php artisan key:generate
    ```

7.  Jalankan migrasi database (Ini akan membuat semua tabel seperti `users`, `bookings`, `routes`, dll):
    ```bash
    php artisan migrate
    ```

8.  (Opsional) Jika ada *seeder*, jalankan *seeder* untuk mengisi data awal:
    ```bash
    php artisan db:seed
    ```

9.  Jalankan server API:
    ```bash
    php artisan serve
    ```
    ✅ **Server Backend Anda sekarang berjalan di `http://127.0.0.1:8000`**

---

### 2. Setup Frontend (Next.js Web)

Frontend akan berjalan di `http://localhost:3000`.

1.  **Buka terminal KEDUA** (biarkan terminal pertama tetap menjalankan server API).
2.  Masuk ke folder web:
    ```bash
    cd travel-web
    ```

3.  Install dependensi JavaScript (NPM atau Yarn):
    ```bash
    npm install
    # atau
    yarn install
    ```

4.  Buat file `.env.local` Anda. File ini akan memberitahu Next.js di mana alamat API Laravel Anda.
    * Buat file baru bernama `.env.local` di dalam `travel-web`.
    * Tambahkan baris berikut ke dalamnya:

    ```
    NEXT_PUBLIC_API_URL=[http://127.0.0.1:8000](http://127.0.0.1:8000)
    ```

5.  Jalankan server *development* Next.js:
    ```bash
    npm run dev
    # atau
    yarn dev
    ```
    ✅ **Server Frontend Anda sekarang berjalan di `http://localhost:3000`**

Anda sekarang dapat membuka `http://localhost:3000` di *browser* Anda untuk menggunakan aplikasi.

---

## 🌐 Contoh API Endpoint (Backend)

* `POST /api/v1/register` - Registrasi user baru.
* `POST /api/v1/login` - Login user (mengembalikan token Sanctum).
* `GET /api/v1/trips/search` - Mencari jadwal perjalanan.
    * Contoh *query*: `?from_city_id=1&to_city_id=2&date=2025-11-10`
* `POST /api/v1/bookings` - (Perlu token) Membuat booking baru.
* `GET /api/v1/user` - (Perlu token) Mendapatkan data user yang sedang login.