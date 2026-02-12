document.addEventListener('DOMContentLoaded', () => {
    // 1. Siapkan komponen Shared (Header & Modal)
    renderHeader();
    renderGlobalModal();

    // 2. Langsung Jalankan Dashboard sesuai Role
    const role = localStorage.getItem('userRole') || 'user';
    console.log("Current Role:", role);

    if (role === 'admin') {
        if (window.AdminDashboard) {
            window.AdminDashboard.render('main-content');
        } else {
            console.error("Gagal: window.AdminDashboard tidak ditemukan.");
        }
    } else {
        if (window.UserDashboard) {
            window.UserDashboard.render('main-content');
        } else {
            console.error("Gagal: window.UserDashboard tidak ditemukan.");
        }
    }
});

/**
 * Render Header Halaman (Judul & Tanggal)
 */
function renderHeader() {
    const headerContainer = document.getElementById('page-header');
    if (!headerContainer) return;

    const todayDate = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const role = localStorage.getItem('userRole') || 'user';
    
    // Custom Text berdasarkan Role
    const title = role === 'admin' ? 'Admin Dashboard' : 'User Dashboard';
    const subtitle = role === 'admin' ? 'Ringkasan aktivitas & persetujuan ruangan.' : 'Selamat datang, mau pinjam ruangan mana?';

    headerContainer.innerHTML = `
        <div>
            <h2 class="text-3xl font-bold text-main-dark capitalize tracking-tight">${title}</h2>
            <p class="text-gray-600 mt-1">${subtitle}</p>
        </div>
        <div class="hidden sm:flex text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm items-center gap-2 border border-gray-100">
            ${Icons.calendar ? Icons.calendar('w-4 h-4 text-user') : '📅'} 
            <span class="font-medium">${todayDate}</span>
        </div>
    `;
}

/**
 * Render HTML Modal ke dalam Body (Hidden by default)
 * Agar tidak tertimpa saat main-content di-render ulang
 */
function renderGlobalModal() {
    // Cek jika modal sudah ada biar tidak double render
    if (document.getElementById('booking-modal')) return;

    const modalHTML = `
        <div id="booking-modal" class="fixed inset-0 bg-black/60 hidden flex items-center justify-center z-50 backdrop-blur-sm transition-opacity duration-300">
            <div class="bg-white w-full max-w-md mx-4 rounded-2xl shadow-2xl transform scale-100 flex flex-col overflow-hidden animate-fade-in-up">
                
                <div class="bg-gradient-to-r from-main-dark to-gray-800 text-white px-6 py-4 flex justify-between items-center">
                    <h3 class="font-bold text-lg tracking-wide">Detail Booking</h3>
                    <button onclick="closeModal()" class="text-white/70 hover:text-white transition transform hover:rotate-90">
                        ${Icons.close ? Icons.close('w-6 h-6') : 'X'}
                    </button>
                </div>
                
                <div class="p-6 space-y-5 text-sm">
                    <div class="flex items-start gap-4">
                        <div class="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                             ${Icons.room ? Icons.room('w-6 h-6') : '🏢'}
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider">Ruangan</label>
                            <p id="modal-room-name" class="text-lg font-bold text-gray-800">-</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div>
                            <label class="block text-xs font-bold text-gray-400 uppercase">Tanggal</label>
                            <p id="modal-date" class="font-semibold text-gray-700 mt-1">-</p>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-400 uppercase">Peminjam</label>
                            <p id="modal-user" class="font-semibold text-gray-700 mt-1">-</p>
                        </div>
                    </div>

                    <div class="flex items-center justify-between gap-2">
                        <div class="text-center w-full bg-green-50 text-green-700 p-2 rounded-lg border border-green-100">
                            <label class="block text-[10px] font-bold uppercase">Mulai</label>
                            <p id="modal-start" class="font-bold text-base">-</p>
                        </div>
                        <span class="text-gray-300">➜</span>
                        <div class="text-center w-full bg-red-50 text-red-700 p-2 rounded-lg border border-red-100">
                            <label class="block text-[10px] font-bold uppercase">Selesai</label>
                            <p id="modal-end" class="font-bold text-base">-</p>
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Keperluan</label>
                        <p id="modal-purpose" class="text-gray-600 italic bg-gray-50 p-3 rounded-lg border border-gray-100 leading-relaxed min-h-[60px]">-</p>
                    </div>
                </div>

                <div class="bg-gray-50 px-6 py-4 flex justify-end">
                    <button onclick="closeModal()" class="bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 font-bold py-2 px-6 rounded-lg transition shadow-sm">
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Tambahkan listener untuk tutup modal jika klik area hitam (overlay)
    const modalEl = document.getElementById('booking-modal');
    modalEl.addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
}

/**
 * LOGIC GLOBAL MODAL
 * Dipanggil oleh tombol "Detail" di Admin/User Dashboard
 */
window.showBookingDetail = function(bookingId) {
    // Ambil data dari Global Variable (Window) yang diisi oleh admin.js / user.js
    // Pastikan admin.js/user.js mengisi window.currentBookings & window.currentRooms saat fetch data
    const bookings = window.currentBookings || [];
    const rooms = window.currentRooms || [];

    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) {
        console.error("Booking data not found for ID:", bookingId);
        return;
    }

    const room = rooms.find(r => r.id === booking.roomId);

    // Isi Data ke Element Modal
    setText('modal-room-name', room ? room.name : 'Unknown Room');
    setText('modal-user', booking.bookedBy);
    setText('modal-date', new Date(booking.startDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
    setText('modal-start', new Date(booking.startDate).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}));
    setText('modal-end', new Date(booking.endDate).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}));
    setText('modal-purpose', booking.description || "Tidak ada deskripsi.");

    // Tampilkan Modal
    const modal = document.getElementById('booking-modal');
    modal.classList.remove('hidden');
}

window.closeModal = function() {
    const modal = document.getElementById('booking-modal');
    modal.classList.add('hidden');
}

// Helper kecil untuk set text aman
function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
}