import { Icons } from '../icons.js';

export const TodaySchedule = {
    /**
     * Menghasilkan HTML untuk tabel jadwal hari ini
     * @param {Array} bookings - Semua data booking
     * @param {Array} rooms - Semua data ruangan
     * @returns {string} HTML string
     */
    render(bookings, rooms) {
        const today = new Date().toDateString();
        
        // 1. Logika Filter: Hanya yang Approved (1) dan Hari Ini
        const activeToday = bookings.filter(b => {
            const s = String(b.status || b.Status).toLowerCase();
            const bDate = new Date(b.startTime || b.StartTime).toDateString();
            return (s === '1' || s === 'approved') && bDate === today;
        });
        
        // 2. Logika Urutkan berdasarkan waktu mulai
        activeToday.sort((a, b) => new Date(a.startTime || a.StartTime) - new Date(b.startTime || b.StartTime));

        // 3. Header Tabel
        let html = `
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
                <div class="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 class="font-bold text-lg text-main-dark">Jadwal Ruangan Hari Ini</h3>
                    <span class="text-xs font-bold px-3 py-1 bg-green-100 text-green-700 rounded-full">
                        ${new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </span>
                </div>
                <div class="overflow-x-auto">
        `;

        if (activeToday.length === 0) {
            html += `
                <div class="text-center py-10">
                    <p class="text-gray-400 italic">Belum ada ruangan yang terpakai hari ini.</p>
                    <p class="text-user font-bold">Semua ruangan kosong!</p>
                </div>
            `;
        } else {
            html += `
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
                            <th class="p-4 font-bold">Ruangan</th>
                            <th class="p-4 font-bold">Jam</th>
                            <th class="p-4 font-bold">Peminjam</th>
                            <th class="p-4 text-center font-bold">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
            `;
            
            activeToday.forEach(b => {
                const room = rooms.find(r => r.id === (b.roomId || b.RoomId));
                const roomName = room ? room.name : 'Unknown';
                const start = new Date(b.startTime || b.StartTime).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'});
                const end = new Date(b.endTime || b.EndTime).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'});
                
                html += `
                    <tr class="hover:bg-gray-50 transition">
                        <td class="p-4 text-main-dark font-semibold">${roomName}</td>
                        <td class="p-4 text-gray-700 font-medium">${start} - ${end}</td>
                        <td class="p-4 text-gray-600 capitalize">${b.bookedBy || b.BookedBy}</td>
                        <td class="p-4 text-center">
                            <button onclick="showBookingDetail(${b.id || b.Id})" class="text-gray-400 hover:text-user transition">
                                ${Icons.detail ? Icons.detail('w-5 h-5') : "Detail"}
                            </button>
                        </td>
                    </tr>
                `;
            });
            html += `</tbody></table>`;
        }

        html += `</div></div>`;
        return html;
    }
};