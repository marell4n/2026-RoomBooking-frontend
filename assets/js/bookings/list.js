document.addEventListener('DOMContentLoaded', () => {
    BookingList.render('booking-list-container');
});

window.BookingList = {
    // Simpan data saat klik detail agar tidak perlu fetch ulang
    _data: [],

    async render(containerId) {
        const container = document.getElementById(containerId);

        
        const role = localStorage.getItem('userRole') || 'user';
        
        try {
            // Ambil Data Booking & Rooms (untuk nama ruangan)
            const [bookings, rooms] = await Promise.all([
                fetchAPI('/bookings'),
                fetchAPI('/rooms')
            ]);

            if (!bookings || bookings.length === 0) {
                container.innerHTML = `<div class="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">Belum ada data booking.</div>`;
                return;
            }

            this._data = bookings;

            // Sort descending (terbaru diatas)
            bookings.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

            let html = '';
            bookings.forEach(booking => {
                const room = rooms.find(r => r.id === booking.roomId);
                const roomName = room ? room.name : 'Unknown Room';

                // Mapping status ke badge
                const rawStatus = booking.status || booking.Status || 'Unknown';
                const statusKey = String(rawStatus).toLowerCase();

                // Status Badge
                const statusConfig = {
                    'pending': { text: 'Pending', class: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
                    'approved': { text: 'Approved', class: 'bg-green-100 text-green-800 border-green-200' },
                    'rejected': { text: 'Rejected', class: 'bg-red-100 text-red-800 border-red-200' },
                    'cancelled': { text: 'Cancelled', class: 'bg-gray-100 text-gray-600 border-gray-200' }
                };
                const status = statusConfig[statusKey] || { text: rawStatus, class: 'bg-gray-100 text-gray-500' };

                // Format Date
                const start = new Date(booking.startTime);
                const end = new Date(booking.endTime);
                const dateStr = start.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
                const timeStr = `${start.toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})} - ${end.toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})}`;

                const id = booking.id || booking.Id;


                html += `
                <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div class="flex-grow">
                        <div class="flex items-center gap-3 mb-2">
                            <h3 class="font-bold text-lg text-main-dark">${roomName}</h3>
                            <span class="px-2 py-0.5 rounded text-xs font-bold border ${status.class}">${status.text}</span>
                        </div>
                        <div class="text-sm text-gray-500 flex gap-4">
                            <span>📅 ${dateStr}</span>
                            <span>⏰ ${timeStr}</span>
                            <span>👤 ${booking.bookedBy}</span>
                        </div>
                    </div>
                    
                    <div class="flex gap-2">
                        <button onclick="BookingList.showDetail(${id})" class="px-3 py-2 bg-main-light text-main-dark border border-gray-200 rounded-lg hover:bg-gray-200 text-sm font-bold transition flex items-center gap-1">
                            ${typeof Icons !== 'undefined' && Icons.detail ? Icons.detail('w-4 h-4') : "Detail"} Detail
                        </button>
                        
                        <a href="booking-form.html?id=${booking.id}" class="px-3 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-200 text-sm font-bold transition">
                            Edit
                        </a>

                        <a href="javascript:void(0)" onclick="BookingList.delete(${booking.id})" class="px-3 py-2 border border-gray-200 text-gray-600 bg-red-300 rounded-lg hover:bg-red-400 text-sm font-bold transition">
                            Delete
                        </a>
                    </div>
                </div>`;
            });
            container.innerHTML = html;

        } catch (error) {
            console.error(error);
            container.innerHTML = `<div class="text-red-500 text-center">Gagal memuat data.</div>`;
        }
    },

    // Fungsi Update Status (Admin)
    async updateStatus(id, newStatus) {
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
                
                // 1. Tutup Modal otomatis
                document.getElementById('detail-modal')?.remove();
                
                // 2. Refresh halaman list di belakangnya
                this.render('booking-list-container');
            } else {
                const err = await res.json();
                alert('Gagal memperbarui status booking: ' + (err.title || 'Terjadi kesalahan.'));
            }
        } catch (e) {
            console.error(e);
            alert('Terjadi kesalahan saat mengupdate status booking.');
        }
    },

    // Fungsi tampilkan detail booking dalam modal
    showDetail(id) {
        // Ambil data dari memory local (this._data) biar cepat
        const booking = this._data.find(b => (b.id || b.Id) === id);
        if (!booking) return;

        const role = localStorage.getItem('userRole') || 'user';

        // Helper untuk format tanggal lengkap
        const formatDateFull = (isoString) => {
            if (!isoString) return '-';
            return new Date(isoString).toLocaleString('id-ID', {
                dateStyle: 'full', timeStyle: 'short'
            });
        };

        // Ambil properti (handle PascalCase/camelCase)
        const roomName = booking.roomName || booking.RoomName;
        const bookedBy = booking.bookedBy || booking.BookedBy;
        const start = formatDateFull(booking.startTime || booking.StartTime);
        const end = formatDateFull(booking.endTime || booking.EndTime);
        const statusUpdated = formatDateFull(booking.statusUpdatedAt || booking.StatusUpdatedAt);
        const updatedAt = formatDateFull(booking.updatedAt || booking.UpdatedAt);
        const purpose = booking.purpose || booking.Purpose;
        const status = String(booking.status || booking.Status || 'Unknown');

        // Tombol untuk edit status yang sudah disetujui/ditolak (khusus admin)
        let adminButtons = '';

        if (role === 'admin') {
            if (status === 'approved' || status === 'Approved') {
                adminButtons = `
                    <button onclick="BookingList.updateStatus(${id}, 2)" title="Batalkan Approval (Reject)" class="px-2 py-1 bg-white border border-red-200 text-red-500 text-xs font-bold rounded hover:bg-red-50 transition">
                        Reject
                    </button>
                `;
            }
            else if (status === 'rejected' || status === 'Rejected') {
                adminButtons = `
                    <button onclick="BookingList.updateStatus(${id}, 1)" title="Approve Ulang" class="px-2 py-1 bg-white border border-green-200 text-green-500 text-xs font-bold rounded hover:bg-green-50 transition">
                        Approve
                    </button>
                `;
            }
        }

        // Render Modal
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
                                <p class="font-bold capitalize text-user">${status}</p>
                                ${adminButtons}
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
                    <div class="bg-gray-50 p-4 text-center">
                        <button onclick="document.getElementById('detail-modal').remove()" class="w-full bg-white border border-gray-300 py-2 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition">
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    },

    async delete(id) {
        if(!confirm('Batalkan booking ini?')) return;
        const res = await fetch(`${API_BASE_URL}/bookings/${id}`, { method: 'DELETE' });
        if(res.ok) this.render('booking-list-container');
    }
};