import { UserDashboard } from "./user";
import { AdminDashboard } from "./admin";
import { fetchAPI } from '../api.js';
import { Icons } from '../icons.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Siapkan komponen Shared (Header & Modal)
    renderHeader();
    renderGlobalModal();

    // 2. Langsung Jalankan Dashboard sesuai Role
    const role = localStorage.getItem('userRole') || 'user';
    console.log("Role detected:", role);

    if (role === 'admin') {
        AdminDashboard.init();
    } else {
        UserDashboard.init();
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
            ${Icons.calendar ? Icons.calendar('w-4 h-4') : '📅'} 
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
        <div id="booking-modal" class="fixed inset-0 bg-black/60 hidden items-center justify-center z-50 backdrop-blur-sm transition-opacity duration-300">
            <div class="bg-white w-full max-w-md mx-4 rounded-2xl shadow-2xl transform scale-100 flex flex-col overflow-hidden animate-fade-in-up">
                
                <div class="bg-linear-to-r from-main-dark to-gray-800 text-white px-6 py-4 flex justify-between items-center">
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
                        <p id="modal-purpose" class="text-gray-600 italic bg-gray-50 p-3 rounded-lg border border-gray-100 leading-relaxed min-h-15">-</p>
                    </div>
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
window.showBookingDetail = function(id) {
    // Ambil data dari window.currentBookings (yang sudah diset di admin.js/user.js)
    const bookings = window.currentBookings || [];
    const rooms = window.currentRooms || [];
    
    const booking = bookings.find(b => (b.id || b.Id) === id);
    if (!booking) {
        alert("Data booking tidak ditemukan.");
        return;
    }

    // Helper
    const role = localStorage.getItem('userRole') || 'user';
    const formatDateFull = (isoString) => {
        if (!isoString) return '-';
        return new Date(isoString).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' });
    };

    // Mapping Data
    const room = rooms.find(r => r.id === (booking.roomId || booking.RoomId));
    const roomName = room ? room.name : (booking.RoomName || 'Unknown Room');
    
    const bookedBy = booking.bookedBy || booking.BookedBy;
    const purpose = booking.purpose || booking.Purpose;
    const start = formatDateFull(booking.startTime || booking.StartTime);
    const end = formatDateFull(booking.endTime || booking.EndTime);
    const statusUpdated = formatDateFull(booking.statusUpdatedAt || booking.StatusUpdatedAt);
    const updatedAt = formatDateFull(booking.updatedAt || booking.UpdatedAt);
    
    const rawStatus = booking.status || booking.Status || 'Unknown';
    const statusKey = String(rawStatus).toLowerCase();

    const statusConfig = {
        'pending': { text: 'Pending', class: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
        'approved': { text: 'Approved', class: 'bg-green-100 text-green-800 border-green-200' },
        'rejected': { text: 'Rejected', class: 'bg-red-100 text-red-800 border-red-200' },
        'cancelled': { text: 'Cancelled', class: 'bg-gray-100 text-gray-600 border-gray-200' }
    };
    // Default ke abu-abu jika tidak match
    const statusBadge = statusConfig[statusKey] || { text: rawStatus, class: 'bg-gray-100 text-gray-500' };

    // Logic Tombol Admin (Persis seperti list.js)
    let adminButtons = '';

    if (role === 'admin') {
        if (statusKey === 'approved' || statusKey === 'Approved') {
            adminButtons = `
                <button onclick="updateDashboardStatus(${id}, 2)" title="Batalkan Approval (Reject)" class="px-2 py-1 bg-white border border-red-200 text-red-500 text-xs font-bold rounded hover:bg-red-50 transition">
                    Reject
                </button>
            `;
        }
        else if (statusKey === 'rejected' || statusKey === 'Rejected') {
            adminButtons = `
                <button onclick="updateDashboardStatus(${id}, 1)" title="Approve Ulang" class="px-2 py-1 bg-white border border-green-200 text-green-500 text-xs font-bold rounded hover:bg-green-50 transition">
                    Approve
                </button>
            `;
        }
    }

    // Render Modal HTML
    const modalHTML = `
        <div id="detail-modal" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div class="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
                <div class="bg-main-dark text-white p-6 flex justify-between items-center">
                    <h3 class="text-xl font-bold">Detail Booking</h3>
                    <button onclick="document.getElementById('detail-modal').remove()" class="text-white/70 hover:text-white">✕</button>
                </div>
                <div class="p-6 space-y-4">
                    <div class="flex justify-between items-start border-b pb-4">
                        <div>
                            <label class="text-xs text-gray-400 font-bold uppercase">Ruangan</label>
                            <p class="text-lg font-bold text-main-dark">${roomName}</p>
                        </div>
                        <div class="text-right">
                            <label class="text-xs text-gray-400 font-bold uppercase">Status</label>
                            <div class="mt-1">
                                <span class="mr-1">
                                    ${adminButtons}
                                </span>
                                <span class="px-3 py-1 rounded-lg text-sm font-bold border ${statusBadge.class}">
                                    ${statusBadge.text}
                                </span>
                                
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 gap-4 bg-gray-50 rounded-xl">
                        <div>
                            <label class="text-xs text-gray-400 font-bold uppercase">Mulai</label>
                            <p class="text-sm font-semibold text-gray-700">🕒 ${start}</p>
                        </div>
                        <div>
                            <label class="text-xs text-gray-400 font-bold uppercase">Selesai</label>
                            <p class="text-sm font-semibold text-gray-700">🕒 ${end}</p>
                        </div>
                    </div>

                    <div>
                        <label class="text-xs text-gray-400 font-bold uppercase">Booked By</label>
                        <p class="text-gray-800 font-medium">👤 ${bookedBy}</p>
                    </div>
                    <div>
                        <label class="text-xs text-gray-400 font-bold uppercase">Keperluan</label>
                        <p class="text-gray-700 italic">"${purpose}"</p>
                    </div>

                    <div class="pt-4 mt-4 border-t border-gray-100 text-s text-gray-500 space-y-1">
                        <div class="flex justify-between">
                            <span>Status Updated:</span>
                            <span>${statusUpdated}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Last Modified:</span>
                            <span>${updatedAt}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Function Update Status (Khusus Dashboard)
window.updateDashboardStatus = async function(id, newStatus) {
    const actionName = newStatus === 1 ? 'MENYETUJUI' : 'MENOLAK';
    if(!confirm(`Yakin ingin ${actionName} booking ini?`)) return;

    try {
        const payload = { status: newStatus };
        const res = await fetch(`${API_BASE_URL}/bookings/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert(`Berhasil ${newStatus === 1 ? 'disetujui' : 'ditolak'}!`);
            document.getElementById('dashboard-detail-modal')?.remove();
            
            // Refresh Dashboard (Reload halaman biar data terupdate semua)
            // Karena dashboard punya banyak widget yang harus dihitung ulang,
            // reload adalah cara paling aman dan mudah.
            location.reload(); 
        } else {
            const err = await res.json();
            alert('Gagal: ' + (err.title || 'Error Backend'));
        }
    } catch (e) {
        console.error(e);
        alert('Gagal koneksi server.');
    }
};

window.closeModal = function() {
    const modal = document.getElementById('dashboard-detail-modal');
    if (modal) modal.remove();
}

// Helper kecil untuk set text aman
function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
}