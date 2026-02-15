# Room Booking Frontend

Aplikasi antarmuka pengguna (frontend) untuk sistem peminjaman ruangan kampus.

## Teknologi
- **Core**: JavaScript (ES Modules), HTML5
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Fetch API Wrapper (Custom Module)
- **Icons**: SVG Icons (Heroicons/Custom)

## Fitur
### Rilis v1.0.0
1. **Dashboard Interaktif**
    * **User Dashboard:** Menampilkan jadwal ruangan hari ini secara *real-time*.
    * **Admin Dashboard:** Ringkasan statistik status pengajuan dan jadwal ruangan hari ini secara *real-time*.

* **Room Management (Admin)**
    * **CRUD Ruangan:** Menambah, melihat, mengedit, dan menghapus (*soft delete*) data ruangan.
    * **Pencarian:** Fitur pencarian ruangan berdasarkan nama dan fasilitas.

* **Booking System**
    * **Form Peminjaman:** Antarmuka bagi user untuk mengajukan peminjaman ruangan.
    * **Validasi:** Pengecekan input tanggal dan waktu sebelum dikirim ke server.
    * **Status Tracking:** Memantau status pengajuan (*Pending*, *Approved*, *Rejected*, *Cancelled*).

* **Admin Approval**
    * **Manajemen Pengajuan:** Admin dapat menyetujui atau menolak pengajuan peminjaman dari user.
    * **Audit Trail:** Melihat detail siapa yang mengajukan dan untuk keperluan apa.

## Cara Install (Local)
### Syarat
- [Node.js](https://nodejs.org/) (Versi 18 atau lebih baru)
- [NPM](https://www.npmjs.com/) (Biasanya sudah satu paket dengan Node.js)
- Backend API yang sudah berjalan (Default: `http://localhost:5017`)

### Langkah Instalasi
1. **Clone Repository**
    ```bash
    git clone [https://github.com/marell4n/2026-roombooking-frontend.git]
    cd 2026-roombooking-frontend
    ```
2. **Install Dependencies**
    Instal semua pustaka yang dibutuhkan (termasuk Vite dan Tailwind).
    ```bash
    npm install
    ```
3. **Konfigurasi API**
    Buka file `assets/js/api.js` dan sesuaikan `API_BASE_URL` dengan alamat server backend Anda jika berbeda.
    ```javascript
    // assets/js/api.js
    const API_BASE_URL = "http://localhost:5017/api"; 
    ```
4.  **Jalankan Server Development**
    ```bash
    npm run dev
    ```
    Buka browser dan akses alamat yang muncul di terminal (biasanya `http://localhost:5173`).