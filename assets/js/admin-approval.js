import { fetchAPI } from "../../src/utils/api.js";

const AdminApproval = {
    _data: [], // Simpan raw data

    async init() {
        const container = document.getElementById('approval-list');
        if (!container) return;

        container.innerHTML = `<div class="text-center py-20 text-gray-400">Memuat data...</div>`;
        
        try {
            // Fetch Data
            const [bookings, rooms] = await Promise.all([
                fetchAPI('/bookings'),
                fetchAPI('/rooms')
            ]);

            if (!bookings || bookings.length === 0) {
                this.renderEmpty(container);
                return;
            }

            // Hanya ambil yang Pending (Status 0 / "Pending")
            // Gunakan logika status yang sama dengan list.js agar konsisten
            const pendingBookings = bookings.filter(b => {
                const rawStatus = b.status || b.Status;
                const s = String(rawStatus).toLowerCase();
                return s === '0' || s === 'pending';
            });

            if (pendingBookings.length === 0) {
                this.renderEmpty(container);
                return;
            }

            // Simpan data pending ke memori
            this._data = pendingBookings;

            this.renderList(pendingBookings, rooms, container);
        } catch (error) {
            console.error(error);
            container.innerHTML = `<div class="text-red-500 text-center font-bold">Gagal memuat data. Pastikan Backend menyala.</div>`;
        }
    },

    renderList(pendingBookings, rooms, container) {
            let html = '';
            pendingBookings.forEach(booking => {
                const rId = booking.roomId || booking.RoomId;
                const room = rooms.find(r => r.id === rId);
                const roomName = room ? room.name : (booking.RoomName || 'Unknown Room');

                // Mapping Data
                const start = new Date(booking.startTime || booking.StartTime);
                const end = new Date(booking.endTime || booking.EndTime);
                const bookedBy = booking.bookedBy || booking.BookedBy;
                const purpose = booking.purpose || booking.Purpose || '-';
                const id = booking.id || booking.Id;

                const dateStr = start.toLocaleDateString('id-ID', { weekday:'long', day: 'numeric', month: 'long', year: 'numeric' });
                const timeStr = `${start.toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})} - ${end.toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})}`;

                html += `
                <div class="bg-main-white p-6 rounded-2xl shadow-lg border-l-4 border-admin flex flex-col md:flex-row justify-between items-start gap-6 animate-fade-in-up hover:shadow-xl transition">
                    
                    <div class="grow">
                        <div class="flex items-center gap-2 mb-2">
                            <h3 class="text-xl font-bold text-main-dark">${roomName}</h3>
                            <span class="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded border border-yellow-200">⏳ Pending Approval</span>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8 text-sm text-gray-600 mb-4">
                            <div class="flex items-center gap-2">
                                <span>📅</span> <strong>${dateStr}</strong>
                            </div>
                            <div class="flex items-center gap-2">
                                <span>⏰</span> <strong>${timeStr}</strong>
                            </div>
                            <div class="flex items-center gap-2">
                                <span>👤</span> <span>${bookedBy}</span>
                            </div>
                        </div>

                        <div class="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <p class="text-xs text-gray-400 font-bold uppercase mb-1">Keperluan:</p>
                            <p class="text-gray-700 italic">"${purpose}"</p>
                        </div>
                    </div>

                    <div class="flex md:flex-col gap-3 w-full md:w-auto shrink-0">
                        <button onclick="AdminApproval.process(${id}, 1)" class="flex-1 md:w-40 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-bold shadow-md shadow-green-200 transition flex items-center justify-center gap-2">
                            Setujui
                        </button>
                        
                        <button onclick="AdminApproval.process(${id}, 2)" class="flex-1 md:w-40 bg-main-white border-2 border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 py-3 px-4 rounded-xl font-bold transition flex items-center justify-center gap-2">
                            Tolak
                        </button>
                    </div>
                </div>`;
            });

            container.innerHTML = html;
    },


    renderEmpty(container) {
        container.innerHTML = `
            <div class="text-center py-20 bg-main-white/50 rounded-2xl border-2 border-dashed border-gray-300">
                <div class="text-6xl mb-4">🎉</div>
                <h3 class="text-xl font-bold text-gray-600">Semua Beres!</h3>
                <p class="text-gray-500 mt-2">Tidak ada pengajuan booking yang menunggu persetujuan.</p>
            </div>`;
    },

    // Fungsi Update Status
    async process(id, newStatus) {
        const actionName = newStatus === 1 ? 'MENYETUJUI' : 'MENOLAK';
        if(!confirm(`Yakin ingin ${actionName} pengajuan ini?`)) return;

        // Siapkan payload (sesuaikan dengan format API)
        const payload = {
            status:newStatus
        }

        try {
            // Endpoint patch 
            await fetchAPI(`/bookings/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            alert(`Berhasil ${newStatus === 1 ? 'menyetujui' : 'menolak'} booking!`);
            this.init(); // Refresh list
        
        } catch (e) {
            console.error(e);
            alert('Terjadi kesalahan saat memproses permintaan.');
        }
    }
};

// Expose ke global agar bisa dipanggil dari HTML
window.AdminApproval = AdminApproval;

// Cek keamanan (hanya Admin yang boleh akses script ini)
document.addEventListener('DOMContentLoaded', () => {
    const role = localStorage.getItem('userRole');
    if (role !== 'admin') {
        alert("Akses Ditolak: Halaman ini khusus Admin.");
        window.location.href = 'index.html';
        return;
    }

    AdminApproval.init();
});