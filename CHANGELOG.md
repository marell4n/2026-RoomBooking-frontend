# Changelog

Semua perubahan yang dilakukan akan didokumentasikan di dalam file ini.

## [Unreleased]

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
    - Menampilkan informasi waktu update status (`StatusUpdatedAt`) dan waktu perubahan data terakhir (`UpdatedAt`)

  ## Fixed
  - Memperbaiki `status` dari **booking** agar dapat muncul di tampilan list.