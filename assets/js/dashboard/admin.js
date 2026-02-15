// Import library atau modul yang dibutuhkan
import { fetchAPI } from '../api.js';
import { Icons } from '../icons.js';

export const AdminDashboard = { 
    async init(containerId = 'main-content') {
        const container = document.getElementById(containerId);
        if (!container) return;

        console.log("Admin Dashboard Initialized");
        container.innerHTML = `<div class="text-center py-20 text-gray-400">Mengambil data...</div>`;

        try {
            // Fetch Data
            const [bookings, rooms] = await Promise.all([
                fetchAPI('/bookings'),
                fetchAPI('/rooms')
            ]);

            if (!bookings || !rooms) {
                container.innerHTML = `<div class="text-red-500 text-center">Gagal mengambil data.</div>`;
                return;
            }

            // Simpan ke window agar dapat diakses oleh Modal Detail (init.js)
            window.currentBookings = bookings;
            window.currentRooms = rooms;

            // Kalkulasi Statistik
            const totalRooms = rooms.length;

            // Hitung status pending
            const pendingCount = bookings.filter(b => {
                const s = String(b.status || b.Status).toLowerCase();
                return s === '0' || s === 'pending';
            }).length;

            // Hitung Approved Hari Ini
            const today = new Date().toDateString();
            const todaysBookings = bookings.filter(b => {
                const s = String(b.status || b.Status).toLowerCase();
                const bDate = new Date(b.startTime || b.StartTime).toDateString();
                return (s === '1' || s === 'approved') && bDate === today;
            });

            // Render HTML
            let html = `
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in-up">
                    <a href="rooms.html" class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center hover:shadow-md transition group cursor-pointer relative overflow-hidden">
                        <div class="absolute right-0 top-0 w-16 h-16 bg-blue-400 opacity-10 rounded-bl-full -mr-2 -mt-2 transition group-hover:scale-110"></div>
                        <div class="p-4 rounded-full bg-blue-100 text-blue-600 mr-4 group-hover:bg-blue-200 transition">
                             ${typeof Icons !== 'undefined' ? Icons.room('w-8 h-8') : "rooms"}
                        </div>
                        <div>
                            <p class="text-gray-500 text-sm font-medium">Total Ruangan</p>
                            <h3 class="text-3xl font-bold text-gray-800">${totalRooms}</h3>
                        </div>
                    </a>
                    
                    <a href="admin-approval.html" class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center hover:shadow-md transition group cursor-pointer relative overflow-hidden">
                        <div class="absolute right-0 top-0 w-16 h-16 bg-yellow-400 opacity-10 rounded-bl-full -mr-2 -mt-2 transition group-hover:scale-110"></div>
                        <div class="p-4 rounded-full bg-yellow-100 text-yellow-600 mr-4 group-hover:bg-yellow-200 transition">
                            ${typeof Icons !== 'undefined' ? Icons.clock('w-8 h-8') : "clock"}
                        </div>
                        <div>
                            <p class="text-gray-500 text-sm font-medium">Menunggu Approval</p>
                            <h3 class="text-3xl font-bold text-gray-800">${pendingCount}</h3>
                            ${pendingCount > 0 ? '<span class="text-xs text-yellow-600 font-bold animate-pulse">Butuh tindakan!</span>' : ''}
                        </div>
                    </a>

                    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center hover:shadow-md transition">
                        <div class="p-4 rounded-full bg-admin/20 text-admin mr-4">
                            ${typeof Icons !== 'undefined' ? Icons.calendar('w-8 h-8') : "Kalender"}
                        </div>
                        <div>
                            <p class="text-gray-500 text-sm font-medium">Jadwal Hari Ini</p>
                            <h3 class="text-3xl font-bold text-gray-800">${todaysBookings.length}</h3>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
                    <div class="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 class="font-bold text-lg text-main-dark">Jadwal Ruangan Hari Ini</h3>
                        <span class="text-xs font-bold px-3 py-1 bg-green-100 text-green-700 rounded-full">
                            ${new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </span>
                    </div>
                    
                    <div class="overflow-x-auto">
            `;

            if (todaysBookings.length === 0) {
                html += `<div class="p-10 text-center text-gray-400">
                            ${Icons.empty ? Icons.empty('w-12 h-12 mx-auto mb-2 opacity-50') : ''}
                            <p>Tidak ada jadwal peminjaman hari ini.</p>
                        </div>
                    `;
            } else {
                html += `
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                <th class="p-4">Ruangan</th>
                                <th class="p-4">Jam</th>
                                <th class="p-4">Peminjam</th>
                                <th class="p-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                `;

                // Urutkan berdasarkan waktu mulai
                todaysBookings.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

                todaysBookings.forEach(b => {
                    const room = rooms.find(r => r.id === b.roomId);
                    const roomName = room ? room.name : 'Unknown Room';
                    const start = new Date(b.startTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                    const end = new Date(b.endTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                    
                    html += `
                        <tr class="hover:bg-gray-50 transition">
                            <td class="p-4 text-main-dark font-medium">${roomName}</td>
                            <td class="p-4 font-bold text-gray-700 whitespace-nowrap">
                                ${start} - ${end}
                            </td>
                            <td class="p-4">
                                <div class="flex items-center gap-2">
                                    <span class="text-sm text-gray-600 capitalize">${b.bookedBy}</span>
                                </div>
                            </td>
                            <td class="p-4 text-center">
                                <button onclick="showBookingDetail(${b.id})" class="text-gray-400 hover:text-admin transition">
                                    ${Icons.detail ? Icons.detail('w-5 h-5') : "Detail"}
                                </button>
                            </td>
                        </tr>
                    `;
                });

                html += `</tbody></table>`;
            }

            html += `</div></div>`;
            container.innerHTML = html;

        } catch (error) {
            console.error(error);
            container.innerHTML = `<div class="text-red-500 text-center">Terjadi kesalahan sistem.</div>`;
        }
        
    }
};