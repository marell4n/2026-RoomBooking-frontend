import { Icons } from '../utils/icons.js';
import { BookingModal } from './booking-detail-modal.js';
import { PaginationHelper } from '../utils/pagination-helper.js';

export const TodaySchedule = {
    _activeToday: [],
    _rooms: [],
    itemsPerPage: 5, // Tampilkan 5 jadwal per halaman
    containerId: 'today-schedule-list', // ID untuk tbody tabel

    /**
     * Menghasilkan HTML untuk tabel jadwal hari ini
     * @param {Array} bookings - Semua data booking
     * @param {Array} rooms - Semua data ruangan
     * @returns {string} HTML string
     */

    render(bookings, rooms) {
        // Simpan data ke window secara otomatis agar fungsi detail bisa akses
        window.currentBookings = bookings;
        window.currentRooms = rooms;
        this._rooms = rooms;

        const today = new Date().toDateString();

        // Logika Filter: Hanya yang Approved (1) dan Hari Ini
        this._activeToday = bookings.filter(b => {
            const s = String(b.status || b.Status).toLowerCase();
            const bDate = new Date(b.startTime || b.StartTime).toDateString();
            return (s === '1' || s === 'approved') && bDate === today;
        });

        // Logika Urutkan berdasarkan waktu mulai
        this._activeToday.sort((a, b) => new Date(a.startTime || a.StartTime) - new Date(b.startTime || b.StartTime));

        // Setup Modal
        if (!window.showBookingDetail) {
            window.showBookingDetail = (id) => {
                BookingModal.show(
                    id, 
                    window.currentBookings, 
                    window.currentRooms, 
                    () => location.reload() // Default action untuk dashboard
                );
            };
        }

        // 3. Header Tabel
        let html = `
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
                <div class="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 class="font-bold text-lg text-main-dark">Jadwal Ruangan Hari Ini</h3>
                    <span class="text-xs font-bold px-3 py-1 bg-green-100 text-green-700 rounded-full">
                        ${new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </span>
                </div>
                
                <div id="schedule-table-wrapper" class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
                                <th class="p-4 font-bold">Ruangan</th>
                                <th class="p-4 font-bold">Jam</th>
                                <th class="p-4 font-bold">Peminjam</th>
                                <th class="p-4 text-center font-bold">Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="${this.containerId}" class="divide-y divide-gray-100">
                            </tbody>
                    </table>
                </div>

                <div id="schedules-empty-state" class="hidden text-center py-10">
                    <p class="text-gray-400 italic">Belum ada ruangan yang terpakai hari ini.</p>
                    <p class="text-gray-600 font-bold">Semua ruangan kosong!</p>
                </div>

                <div id="schedule-pagination" class="flex justify-center py-4 border-t border-gray-50"></div>
            </div>
        `;

        return html;
    },

    initPagination() {
        const container = document.getElementById(this.containerId);
        const emptyState = document.getElementById('schedules-empty-state');
        const paginationContainer = document.getElementById('schedule-pagination');
        const tableWrapper = document.getElementById('schedule-table-wrapper');

        if (!container || !paginationContainer) return;

        // Tampilkan empty state jika tidak ada data
        if (this._activeToday.length === 0) {
            if(tableWrapper) tableWrapper.style.display = 'none'; // Sembunyikan Tabel + Header
            if(emptyState) emptyState.classList.remove('hidden'); // Munculkan pesan kosong
            if(paginationContainer) paginationContainer.style.display = 'none'; // Sembunyikan pagination
            return;
        }

        // Pastikan tampil
        if(tableWrapper) tableWrapper.style.display = 'block';
        if(emptyState) emptyState.classList.add('hidden');
        if(paginationContainer) paginationContainer.style.display = 'flex';

        PaginationHelper('schedule-pagination', this._activeToday.length, this.itemsPerPage, (page) => {
            this.updateList(page);
        });

        this.updateList(1); // Render halaman pertama
    },

    updateList(page) {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const startData = (page - 1) * this.itemsPerPage;
        const endData = startData + this.itemsPerPage;
        const paginatedItems = this._activeToday.slice(startData, endData);

        let html = '';

        paginatedItems.forEach(b => {
            const room = this._rooms.find(r => r.id === (b.roomId || b.RoomId));
            const roomName = room ? room.name : 'Unknown';
            const startTime = new Date(b.startTime || b.StartTime).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'});
            const endTime = new Date(b.endTime || b.EndTime).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'});
            html += `
                <tr class="hover:bg-gray-50 transition">
                    <td class="p-4 text-main-dark font-semibold">${roomName}</td>
                    <td class="p-4 text-gray-700 font-medium">${startTime} - ${endTime}</td>
                    <td class="p-4 text-gray-600 capitalize">${b.bookedBy || b.BookedBy}</td>
                    <td class="p-4 text-center">
                        <button onclick="showBookingDetail(${b.id || b.Id})" class="text-gray-400 hover:text-user transition">
                            ${Icons.detail ? Icons.detail('w-5 h-5') : "Detail"}
                        </button>
                    </td>
                </tr>
            `;
        });

        container.innerHTML = html;
    }
};