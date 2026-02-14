document.addEventListener('DOMContentLoaded', () => {
    BookingList.init('booking-list-container');
});

window.BookingList = {
    _bookings: [], // Data mentah semua booking
    _rooms: [],    // Data mentah ruangan
    _containerId: 'booking-list-container',

    // 1. Fetch Data Sekali Saja
    async init(containerId) {
        this._containerId = containerId;
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `<div class="text-center py-20 text-gray-400">Memuat data booking...</div>`;

        try {
            // Fetch Bookings & Rooms Parallel
            const [bookings, rooms] = await Promise.all([
                fetchAPI('/bookings'),
                fetchAPI('/rooms')
            ]);

            if (!bookings) {
                container.innerHTML = `<div class="text-red-500 text-center">Gagal memuat data.</div>`;
                return;
            }

            // Simpan ke memory
            this._bookings = bookings;
            this._rooms = rooms || [];

            // Isi Dropdown Filter
            this.populateRoomFilter();

            // Render awal (Tampilkan semua)
            this.renderList(this._bookings);

        } catch (error) {
            console.error(error);
            container.innerHTML = `<div class="text-red-500 text-center">Terjadi kesalahan koneksi.</div>`;
        }
    },

    // 2. Logika Filtering
    populateRoomFilter() {
        const select = document.getElementById('filter-room');
        if (!select) return;

        select.innerHTML = '<option value="">Semua Ruangan</option>';
        this._rooms.forEach(room => {
            select.innerHTML += `<option value="${room.id}">${room.name}</option>`;
        });
    },

    applyFilter() {
        const dateInput = document.getElementById('filter-date').value;
        const roomInput = document.getElementById('filter-room').value;

        const filtered = this._bookings.filter(b => {
            // Cek Tanggal (Ambil format YYYY-MM-DD)
            const bDate = (b.startTime || b.StartTime).split('T')[0];
            const dateMatch = dateInput ? bDate === dateInput : true;

            // Cek Ruangan
            const rId = b.roomId || b.RoomId;
            const roomMatch = roomInput ? rId == roomInput : true;

            return dateMatch && roomMatch;
        });

        this.renderList(filtered);
    },

    resetFilter() {
        document.getElementById('filter-date').value = '';
        document.getElementById('filter-room').value = '';
        this.renderList(this._bookings); // Tampilkan semua lagi
    },

    // 3. Render HTML (Menerima data yang sudah difilter)
    renderList(bookings) {
        const container = document.getElementById(this._containerId);
        const role = localStorage.getItem('userRole') || 'user';

        if (bookings.length === 0) {
            container.innerHTML = `<div class="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300 text-gray-500">Data booking tidak ditemukan.</div>`;
            return;
        }

        // Sort descending berdasarkan startTime terbaru
        const sortedBookings = [...bookings].sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

        let html = '';
        sortedBookings.forEach(booking => {
            const room = this._rooms.find(r => r.id === booking.roomId);
            const roomName = room ? room.name : 'Unknown Room';

            const rawStatus = booking.status || booking.Status || 'Unknown';
            const statusKey = String(rawStatus).toLowerCase();

            // Status Badge Config
            const statusConfig = {
                'pending': { text: 'Pending', class: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
                '0':       { text: 'Pending', class: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
                'approved':{ text: 'Approved', class: 'bg-green-100 text-green-800 border-green-200' },
                '1':       { text: 'Approved', class: 'bg-green-100 text-green-800 border-green-200' },
                'rejected':{ text: 'Rejected', class: 'bg-red-100 text-red-800 border-red-200' },
                '2':       { text: 'Rejected', class: 'bg-red-100 text-red-800 border-red-200' },
                'cancelled':{ text: 'Cancelled', class: 'bg-gray-100 text-gray-600 border-gray-200' }
            };
            const status = statusConfig[statusKey] || { text: rawStatus, class: 'bg-gray-100 text-gray-500' };

            // Format Date & Time
            const start = new Date(booking.startTime);
            const end = new Date(booking.endTime);
            const dateStr = start.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
            const timeStr = `${start.toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})} - ${end.toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})}`;

            const id = booking.id || booking.Id;

            let buttonsHTML = '';
            
            // Tombol Detail
            buttonsHTML += `
                <button onclick="BookingList.showDetail(${id})" class="px-3 py-2 bg-main-light text-main-dark border border-gray-200 rounded-lg hover:bg-gray-200 text-sm font-bold transition flex items-center gap-1">
                    ${typeof Icons !== 'undefined' && Icons.detail ? Icons.detail('w-4 h-4') : "Detail"} Detail
                </button>`;

            // Tombol Edit & Delete
            if (statusKey === 'pending' || statusKey === '0' || role === 'admin') {
                buttonsHTML += `
                    <a href="booking-form.html?id=${id}" class="px-3 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-200 text-sm font-bold transition">Edit</a>
                    <button onclick="BookingList.delete(${id})" class="px-3 py-2 border border-gray-200 text-gray-600 bg-red-50 hover:bg-red-100 hover:text-red-600 text-sm font-bold transition">Delete</button>
                `;
            }

            html += `
            <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in-up">
                <div class="flex-grow">
                    <div class="flex items-center gap-3 mb-2">
                        <h3 class="font-bold text-lg text-main-dark">${roomName}</h3>
                        <span class="px-2 py-0.5 rounded text-xs font-bold border ${status.class}">${status.text}</span>
                    </div>
                    <div class="text-sm text-gray-500 flex flex-wrap gap-4">
                        <span>📅 ${dateStr}</span>
                        <span>⏰ ${timeStr}</span>
                        <span>👤 ${booking.bookedBy}</span>
                    </div>
                </div>
                
                <div class="flex gap-2">
                    ${buttonsHTML}
                </div>
            </div>`;
        });

        container.innerHTML = html;
    },

    // 4. Detail, Delete, Update Status
    
    // Fungsi Update Status
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
                document.getElementById('detail-modal')?.remove();
                
                // Update data lokal biar gak perlu fetch ulang semua
                const bookingIndex = this._bookings.findIndex(b => b.id === id);
                if (bookingIndex !== -1) {
                    this._bookings[bookingIndex].status = newStatus;
                }
                
                // Render ulang filter yang sedang aktif
                this.applyFilter();
            } else {
                const err = await res.json();
                alert('Gagal update: ' + (err.title || 'Error Backend'));
            }
        } catch (e) {
            console.error(e);
            alert('Error koneksi server.');
        }
    },

    // Fungsi Delete
    async delete(id) {
        if(!confirm('Hapus booking ini?')) return;
        
        try {
            const res = await fetch(`${API_BASE_URL}/bookings/${id}`, { method: 'DELETE' });
            if(res.ok) {
                // Hapus dari memory
                this._bookings = this._bookings.filter(b => b.id !== id);
                // Render ulang
                this.applyFilter();
                alert('Berhasil dihapus.');
            } else {
                alert('Gagal menghapus.');
            }
        } catch(e) { console.error(e); alert('Error koneksi.'); }
    },

    // Fungsi Modal Detail
    showDetail(id) {
        const booking = this._bookings.find(b => (b.id || b.Id) === id);
        if (!booking) return;

        const role = localStorage.getItem('userRole') || 'user';
        const formatDateFull = (iso) => iso ? new Date(iso).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' }) : '-';

        // Ambil data referensi ruangan
        const room = this._rooms.find(r => r.id === booking.roomId);
        const roomName = room ? room.name : (booking.RoomName || 'Unknown');

        // Mapping Status
        const rawStatus = String(booking.status || '0').toLowerCase();
        let statusText = 'Pending';
        if(rawStatus === '1' || rawStatus === 'approved') statusText = 'Approved';
        if(rawStatus === '2' || rawStatus === 'rejected') statusText = 'Rejected';
        if(rawStatus === '3' || rawStatus === 'cancelled') statusText = 'Cancelled';

        // Admin Buttons Logic
        let adminButtons = '';
        if (role === 'admin') {
            if (statusText === 'Approved') {
                adminButtons = `<button onclick="BookingList.updateStatus(${id}, 2)" class="text-xs bg-red-100 text-red-600 px-3 py-1 rounded border border-red-200 font-bold hover:bg-red-200">Reject</button>`;
            } else if (statusText === 'Rejected') {
                adminButtons = `<button onclick="BookingList.updateStatus(${id}, 1)" class="text-xs bg-green-100 text-green-600 px-3 py-1 rounded border border-green-200 font-bold hover:bg-green-200">Approve</button>`;
            } else if (statusText === 'Pending') {
                adminButtons = `
                    <button onclick="BookingList.updateStatus(${id}, 1)" class="text-xs bg-green-600 text-white px-3 py-1 rounded font-bold hover:bg-green-700">Approve</button>
                    <button onclick="BookingList.updateStatus(${id}, 2)" class="text-xs bg-red-50 text-red-600 px-3 py-1 rounded border border-red-200 font-bold hover:bg-red-100">Reject</button>
                `;
            }
        }

        const modalHTML = `
            <div id="detail-modal" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                <div class="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">
                    <div class="bg-main-dark text-white p-5 flex justify-between items-center">
                        <h3 class="text-lg font-bold">Detail Booking</h3>
                        <button onclick="document.getElementById('detail-modal').remove()" class="text-white/70 hover:text-white">✕</button>
                    </div>
                    <div class="p-6 space-y-4">
                        <div class="flex justify-between border-b pb-4">
                            <div><p class="text-xs text-gray-400 font-bold uppercase">Ruangan</p><p class="text-lg font-bold text-main-dark">${roomName}</p></div>
                            <div class="text-right"><p class="text-xs text-gray-400 font-bold uppercase">Status</p><p class="font-bold text-user capitalize">${statusText}</p><div class="mt-2 space-x-2">${adminButtons}</div></div>
                        </div>
                        <div class="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg">
                            <div><p class="text-xs text-gray-400 font-bold uppercase">Mulai</p><p class="text-sm font-semibold">${formatDateFull(booking.startTime)}</p></div>
                            <div><p class="text-xs text-gray-400 font-bold uppercase">Selesai</p><p class="text-sm font-semibold">${formatDateFull(booking.endTime)}</p></div>
                        </div>
                        <div><p class="text-xs text-gray-400 font-bold uppercase">Peminjam</p><p class="font-medium">👤 ${booking.bookedBy}</p></div>
                        <div><p class="text-xs text-gray-400 font-bold uppercase">Keperluan</p><p class="italic text-gray-600">"${booking.purpose}"</p></div>
                    </div>
                </div>
            </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
};