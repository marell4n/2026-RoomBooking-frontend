# Changelog

Semua perubahan yang dilakukan akan didokumentasikan di dalam file ini.

## [v1.0.0] - 15-02-20206
**Initial Release**

### Chore
- Inisialisasi struktur folder frontend (`assets/css`, `assets/js`).
- Membuat file dasar HTML (`index.html`, `rooms.html`, `bookings.html`, `admin-approval.html`).
- Integrasi framework **Tailwind CSS** via CDN.
- Konfigurasi tema warna custom di `tailwind.config`:
  - **Admin:** Cotton Candy (`#E38792`)
  - **User:** Sage Green (`#9DAD71`)
  - **Background:** Off-White (`#F2EEE8`) & Deep Maroon (`#4E0A0B`)

### Added
- Menambahkan **Logic Role-Based** di `assets/js/app.js`.
- Implementasi **Navbar Dinamis** yang merender menu berbeda untuk Admin dan User.
- Menambahkan fitur **Role Switcher** (User/Admin) dengan menggunakan `localStorage`.
- Membuat file `assets/js/icons.js` sebagai pustaka komponen ikon SVG yang dapat digunakan kembali secara global (`window.Icons`).
- Mengimplementasikan logika dashboard modular:
  - `assets/js/dashboard/admin.js`: Menangani tampilan statistik dan tabel approval untuk Admin.
  - `assets/js/dashboard/user.js`: Menangani tampilan *welcome card* untuk User.
  - `assets/js/dashboard/init.js`: Controller utama untuk mendeteksi *role* user dan me-render dashboard yang sesuai.
- Fitur **CRUD Rooms** untuk Admin, Read-only untuk User:
    - Sinkronisasi `GET /api/rooms` untuk menampilkan list ruangan secara dinamis.
    - Implementasi `POST /api/rooms` melalui modal form untuk tambah ruangan.
    - Implementasi `PUT /api/rooms/{id}` untuk edit data ruangan.
    - Implementasi `DELETE /api/rooms/{id}` dengan konfirmasi keamanan.
- Role-based Access Control pada UI Rooms: Tombol Add/Edit/Delete hanya muncul untuk Admin.
- Loading state dan feedback alert setelah aksi CRUD berhasil/gagal.
- Menambahkan **live search** ke room list
- Fitur **CRUD Booking**:
  - Menambah halaman `booking-form.html` berupa halaman form untuk membuat dan mengedit booking.
  - Menambah logika `assets/js/bookings/form.js` untuk menangani *Create* (POST) dan *Update* (PUT)
  - Menambah logika `assets/js/bookings/list.js` untuk menampilkan riwayat booking.
  - Menambah **edit booking** untuk mengedit pengajuan booking mereka.
  - Menambah **soft delete** agar data yang dihapus tidak hilang secara permanen, hanya tidak ditampilkan saja.
  - Fitur **booking detail** di detail model pada logika `assets/js/bookings/list.js`:
    - Menampilkan informasi waktu update status (`StatusUpdatedAt`), waktu perubahan data terakhir (`UpdatedAt`) dan alasan peminjaman (`Purpose`).
  - Menambahkan **validasi** tidak dapat booking di *tanggal/jam masa lalu*.
  - Menambahkan **validasi** agar tidak terjadi *bentrok jadwal* di ruangan yang sama.
  - Menambah **filter** untuk melihat booking pada **tanggal tertentu atau ruangan tertentu**.
- Fitur Admin Approval:
  - Mengisi halaman `admin-approval.html` yang berisikan daftar pengajuan yang memerlukan persetujuan.
  - Menambah `admin-approval.js` untuk otomatis memfilter booking dengan status **Pending**.
  - Menggunakan endpoint `PATCH /api/bookings/{id}/status` untuk menyetujui dan menolak secara efisien, jadi tidak perlu mengirimkan kembali semua data booking ulang dengan endpoint `PUT`.
  - Menambahkan admin dapat mengubah status dari disetujui (`Approved`) menjadi ditolak (`Rejected`) dan sebaliknya.

### Fixed
- Memperbaiki `status` dari **booking** agar dapat muncul di tampilan list.
- **Dashboard**: Kini menampilkan data statistik *real-time* yang diambil dari API, menggantikan tampilan *dummy*.
- Memperbaiki fungsi **tombol update status** yang ada di dashboard untuk admin (kesalahan penulisan fungsi).
- Memperbaiki tampilan dashboard user.
-**Refactoring** Rooms:
  - Mengubah `assets/js/rooms/user.js` menjadi `assets/js/rooms/list.js`, menghapus **detail button**, dan menyembunyikaan **buttons edit dan delete** (hanya admin yang bisa melakukan crud terhadap rooms).
  - Mengubah `assets/js/rooms/user.js` menjadi `assets/js/rooms/form.js`.
  - Memperbaiki fungsi filter/searching ruangan.
- **Refactoring** dari CDN ke Module-Based:
  - Inisialisasi NPM dan instal dependensi `vite`, `@tailwindcss/vite`, `tailwind` v4, `postcss`, dan `autoprefixer`.
  - Menambah folder `src/` untuk pusat kontrol modul.
  - Semua konfigurasi warna kustom dan font dipindahkan ke `src/style.css`.
  - Entry point utama dengan `src/main.js` untuk memuat CSS.
- **Refactoring** script dan HTML:
  - Modifikasi `assets/js/api.js` agar kompatibel dengan sistem module dan fungsi `window` tetap bisa diakses di script lainnya.
  - Menghapus script CDN yang ada di file HTML.
- Refactoring `api.js` dan `icon.js` menjadi **Modules**
- **Refactoring** Dashboard menjadi **ES Modules**:
  - Menyederhanakan `index.html` dengan menggunakan satu entry point(`init.js`).
  - Mengubah file `init.js`, `user.js`, dan `admin.js` menjadi berbasis **ES Modules**.
  - Menghapus duplikasi kode filter jadwal di `user.js` dan `admin.js` dengan mendelegasikan tugas tersebut ke komponen `TodaySchedule`.
- **Refactoring** `BookingDetail` menjadi **Component** (`BookingDetailModal`):
  - Menghapus duplikasi kode di `dashboard/init.js` dan `bookings/list.js`.
  - Penyesuaikan payload data status agar sesuai dengan standard DTO pada backend.
- **Refactoring** `bookings/list` menjadi module.
- **Refactoring** `/rooms` menjadi module.
- Memperbaiki typo import *fecthAPI* di `/booking/list.js`
- **Refactoring** `assets/js/admin-approval.js` menjadi modul.
- Memperbaiki file component yang tidak terpush ke git.

## [v.1.1.0] - 16-02-2026
### Added
- Menambah library `tui-pagination` untuk membagi data agar tidak perlu scroll panjang.
- Menambah`utils/pagination-helper` untuk kustomisasi pagination
- Menambahkan **pagination** ke `rooms`.
- Menambahkan **pagination** ke `dashboard`.
- Menambahkan **pagination** ke `bookings`.
- Menambahkan **footer** ke `booking.html`, `booking-form.html` dan `admin-approval.html`.

### Fixed
- Memperbaiki penulisan tailwind.

## [v1.2.0] - 16-02-2026
### Fixed
- Mengganti nama aplikasi dan styling dengan font.
- Memisahkan **footer** dari *html* dan membuat component `footer` tersendiri.
- Memisahkan **navbar** dari `app.js` dan membuat component `navbar` tersendiri.
- Memisahkan logika `init()`, `switchRole()` dan `applyTheme()` ke `main.js` (`app.js` dihapus).
- Mengubah nama *BookingDetailModal* menjadi *booking-detail-modal* dan memindahkannya ke `/src/component`.
- Memindahkan *today-schedule* ke `/src/component`.

### Added
- Menambahkan hover ke menu **Admin Approval** di `navbar`.