document.addEventListener('DOMContentLoaded', () => {
    BookingForm.init();
});

window.BookingForm = {
    async init() {
        // 1. Load Dropdown Ruangan
        await this.loadRooms();

        // 2. Cek apakah ini Edit Mode? (Ada parameter ?id=... di URL)
        const urlParams = new URLSearchParams(window.location.search);
        const bookingId = urlParams.get('id');

        if (bookingId) {
            // EDIT MODE
            document.getElementById('form-title').innerText = "Edit Booking";
            document.getElementById('booking-id').value = bookingId;
            this.loadBookingData(bookingId);
        }

        // 3. Listener Submit
        document.getElementById('booking-form').addEventListener('submit', (e) => this.save(e));
    },

    // Ambil Data Ruangan untuk Select Option
    async loadRooms() {
        const select = document.getElementById('inp-room');
        const rooms = await fetchAPI('/rooms');
        
        if (rooms && rooms.length > 0) {
            select.innerHTML = `<option value="">-- Pilih Ruangan --</option>` + 
                rooms.map(r => `<option value="${r.id}">${r.name} (Kapasitas: ${r.capacity})</option>`).join('');
        } else {
            select.innerHTML = `<option value="">Tidak ada ruangan tersedia</option>`;
        }
    },

    // Isi Form jika sedang Edit
    async loadBookingData(id) {
        const booking = await fetchAPI(`/bookings/${id}`);
        if (!booking) {
            alert("Data booking tidak ditemukan!");
            window.location.href = 'bookings.html';
            return;
        }

        // Pecah ISO Date (2025-10-10T14:00:00) menjadi Date dan Time input html
        const start = new Date(booking.startTime);
        const end = new Date(booking.endTime);

        // Fungsi helper buat format YYYY-MM-DD
        const toDateInput = (date) => date.toISOString().split('T')[0];
        // Fungsi helper buat format HH:mm
        const toTimeInput = (date) => date.toTimeString().slice(0, 5);

        document.getElementById('inp-room').value = booking.roomId;
        document.getElementById('inp-name').value = booking.bookedBy;
        document.getElementById('inp-date').value = toDateInput(start);
        document.getElementById('inp-start').value = toTimeInput(start);
        document.getElementById('inp-end').value = toTimeInput(end);
        document.getElementById('inp-desc').value = booking.purpose;
    },

    // Simpan Data (Create / Update)
    async save(e) {
        e.preventDefault();

        const id = document.getElementById('booking-id').value;
        const roomId = document.getElementById('inp-room').value;
        const date = document.getElementById('inp-date').value;
        const start = document.getElementById('inp-start').value;
        const end = document.getElementById('inp-end').value;
        
        // Validasi Jam
        if (end <= start) {
            alert("Jam selesai harus lebih besar dari jam mulai.");
            return;
        }

        // Validasi tidak bisa booking di hari yang sudah lewat
        const today = new Date();
        const bookingDate = new Date(date);
        if (bookingDate < today.setHours(0,0,0,0)) {
            alert("Tidak bisa booking untuk tanggal yang sudah lewat.");
            return;
        }

        // Validasi apakah booking tidak bentrok dengan booking lain di ruangan yang sama (create dan edit) 
        // 1. Ambil semua booking (lebih aman filter di JS kalau backend filter belum pasti)
        const allBookings = await fetchAPI('/bookings'); 

        // 2. Siapkan waktu input user (Satukan date + time)
        // Pastikan format date="YYYY-MM-DD", start="HH:mm", end="HH:mm"
        const inputStart = new Date(`${date}T${start}`).getTime();
        const inputEnd = new Date(`${date}T${end}`).getTime();

        // Validasi dasar: Jam Selesai harus setelah Jam Mulai
        if (inputEnd <= inputStart) {
            alert("Jam selesai harus lebih besar dari jam mulai.");
            return;
        }

        // 3. Cek Conflict
        const hasConflict = allBookings.some(b => {
            // A. Filter Ruangan (Pastikan booking orang lain itu di ruangan yang sama)
            // Pakai == biar aman (misal string "1" vs number 1)
            if (b.roomId != roomId) return false; 

            // B. Filter Diri Sendiri (Kalau lagi Edit)
            if (id && b.id == id) return false;

            // C. Filter Status (PENTING!)
            // Abaikan booking yang sudah Dibatalkan atau Ditolak Admin
            const status = String(b.status || b.Status).toLowerCase();
            if (status === 'cancelled' || status === 'rejected') return false;

            // D. Cek Waktu
            // Ambil waktu booking orang lain
            const bStart = new Date(b.startTime || b.StartTime).getTime();
            const bEnd = new Date(b.endTime || b.EndTime).getTime();

            // RUMUS OVERLAP:
            // (JadwalBaru.Mulai < JadwalLama.Selesai) DAN (JadwalBaru.Selesai > JadwalLama.Mulai)
            return inputStart < bEnd && inputEnd > bStart;
        });

        if (hasConflict) {
            alert("Gagal: Ruangan sudah terisi di jam tersebut (atau mencakup jam tersebut).");
            return;
        }

        const payload = {
            roomId: parseInt(roomId),
            bookedBy: document.getElementById('inp-name').value,
            startTime: `${date}T${start}:00`,
            endTime: `${date}T${end}:00`,
            purpose: document.getElementById('inp-desc').value
        };

        // Tentukan endpoint dan method berdasarkan apakah ini Create atau Edit
        const endpoint = id ? `/bookings/${id}` : `/bookings`;
        const method = id ? 'PUT' : 'POST';

        // Untuk PUT, biasanya butuh ID di body juga
        if(id) payload.id = parseInt(id);

        try {
            // 1. Kirim Request
            // (Header Content-Type sudah otomatis diurus api.js)
            await fetchAPI(endpoint, {
                method: method,
                body: JSON.stringify(payload)
            });

            // 2. Sukses
            // (Kode di bawah ini HANYA jalan kalau statusnya 200 OK)
            alert(`Booking berhasil ${id ? 'diperbarui' : 'dibuat'}!`);
            window.location.href = 'bookings.html';
        } catch (error) {
            console.error(error);
            aalert('Gagal: ' + (err.title || err.message || 'Terjadi kesalahan sistem.'));
        }
    }
};