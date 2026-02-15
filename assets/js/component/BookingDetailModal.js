import { Icons } from "../icons";
import { fetchAPI } from "../api";

export const BookingModal = {
    /**
     * @param {number} id - ID Booking
     * @param {Array} bookings - Data booking yang ada
     * @param {Array} rooms - Data ruangan untuk mapping nama
     * @param {Function} onUpdateSuccess - Apa yang dilakukan setelah admin update status (misal: reload)
     */
    show(id, bookings, rooms, onUpdateSuccess = null) {
        const booking = bookings.find(b => (b.id || b.Id) === id);
        if (!booking) {
            alert("Data tidak ditemukan");
            return;
        }

        const role = localStorage.getItem('userRole') || 'user';
        const room = rooms.find(r => r.id === (booking.roomId || booking.RoomId));
        const roomName = room ? room.name : (booking.RoomName || 'Unknown');

        // Helpers
        const formatDateFull = (iso) => iso ? new Date(iso).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' }) : '-';
        
        const statusKey = String(booking.status || booking.Status).toLowerCase();
        const statusConfig = {
            'pending': { text: 'Pending', class: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
            'approved': { text: 'Approved', class: 'bg-green-100 text-green-800 border-green-200' },
            'rejected': { text: 'Rejected', class: 'bg-red-100 text-red-800 border-red-200' },
            'cancelled': { text: 'Cancelled', class: 'bg-gray-100 text-gray-600 border-gray-200' }
        };
        const statusBadge = statusConfig[statusKey] || { text: statusKey, class: 'bg-gray-100 text-gray-500' };

        // Format Tanggal Update
        const statusUpdated = formatDateFull(booking.statusUpdatedAt || booking.StatusUpdatedAt);
        const updatedAt = formatDateFull(booking.updatedAt || booking.UpdatedAt);

        let adminButtons = '';
        
        // Logic Tombol Admin
        if (role === 'admin') {
            if (statusKey === 'approved' || statusKey === 'Approved') {
                adminButtons = `
                    <button id="modal-btn-reject" title="Batalkan Approval (Reject)" class="px-2 py-1 bg-white border border-red-200 text-red-500 text-xs font-bold rounded hover:bg-red-50 transition">
                        Reject
                    </button>
                `;
            }
            else if (statusKey === 'rejected' || statusKey === 'Rejected') {
                adminButtons = `
                    <button id="modal-btn-approve" title="Approve Ulang" class="px-2 py-1 bg-white border border-green-200 text-green-500 text-xs font-bold rounded hover:bg-green-50 transition">
                        Approve
                    </button>
                `;
            }
        }

        const modalHTML = `
        <div id="global-detail-modal" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div class="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
                <div class="bg-main-dark text-white p-5 flex justify-between items-center">
                    <h3 class="text-xl font-bold">Detail Booking</h3>
                    <button id="modal-close-x" class="text-white/70 hover:text-white transition">✕</button>
                </div>
                <div class="p-6 space-y-5">
                    <div class="flex justify-between items-start border-b pb-4">
                        <div>
                            <label class="text-xs text-gray-400 font-bold uppercase">Ruangan</label>
                            <p class="text-lg font-bold text-main-dark">${roomName}</p>
                        </div>
                        <div class="text-right">
                            <label class="text-xs text-gray-400 font-bold uppercase">Status</label>
                            <div class="mt-1 flex gap-2 justify-end">
                                ${adminButtons}
                                <span class="px-3 py-1 rounded-lg text-xs font-bold border ${statusBadge.class}">${statusBadge.text}</span>
                            </div>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 gap-4 bg-gray-50 rounded-lg">
                        <div><label class="text-xs text-gray-400 font-bold">MULAI</label><p class="text-sm font-semibold">${formatDateFull(booking.startTime || booking.StartTime)}</p></div>
                        <div><label class="text-xs text-gray-400 font-bold">SELESAI</label><p class="text-sm font-semibold">${formatDateFull(booking.endTime || booking.EndTime)}</p></div>
                    </div>
                    <div>
                        <label class="text-xs text-gray-400 font-bold uppercase mb-1 block">Booked By</label>
                        <p class="text-gray-800 font-medium">👤 ${booking.bookedBy || booking.BookedBy}</p>
                    </div>
                    <div>
                        <label class="text-xs text-gray-400 font-bold uppercase mb-1 block">Keperluan</label>
                        <p class="text-gray-600 italic">"${booking.purpose || booking.Purpose || '-'}"</p>
                    </div>
                    <div class="pt-4 mt-4 border-t border-gray-100 text-sm text-gray-500 space-y-1">
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

        // Event Listeners (karena menggunakan module, kita tidak bisa pakai onclick="...")
        document.getElementById('modal-close-x').onclick = () => this.close();
        
        const btnApprove = document.getElementById('modal-btn-approve');
        const btnReject = document.getElementById('modal-btn-reject');
        
        if (btnApprove) btnApprove.onclick = () => this.updateStatus(id, 1, onUpdateSuccess);
        if (btnReject) btnReject.onclick = () => this.updateStatus(id, 2, onUpdateSuccess);

        // Tutup modal jika klik background
        document.getElementById('global-detail-modal').onclick = (e) => {
            if (e.target.id === 'global-detail-modal') this.close();
        };
    },

    close() {
        document.getElementById('global-detail-modal')?.remove();
    },

    async updateStatus(id, newStatus, callback) {
        const action = newStatus === 1 ? 'MENYETUJUI' : 'MENOLAK';
        if (!confirm(`Yakin ingin ${action} booking ini?`)) return;

        try {
            await fetchAPI(`/bookings/${id}/status`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });
            alert(`Berhasil ${newStatus === 1 ? 'disetujui' : 'ditolak'}!`);
            this.close();
            if (callback) callback();
        } catch (e) {
            console.error(e);
            alert("Gagal memperbarui status.");
        }
    }
};