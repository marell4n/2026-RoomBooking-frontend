// Import library atau modul yang dibutuhkan
import { fetchAPI } from '../api.js';
import { Icons } from '../icons.js';

export const UserDashboard = {
    async init(containerId = 'main-content') {
        const container = document.getElementById(containerId);
        if (!container) return;

        console.log("User Dashboard initialized");
        container.innerHTML = `<div class="text-center py-20 text-gray-400">Memuat dashboard...</div>`;

        try {
            const [bookings, rooms] = await Promise.all([
                fetchAPI('/bookings'),
                fetchAPI('/rooms')
            ]);

            if (!bookings || !rooms) {
                container.innerHTML = `<div class="text-red-500 text-center">Gagal memuat data.</div>`;
                return;
            }

            // Simpan ke window agar modal detail bisa jalan
            window.currentBookings = bookings;
            window.currentRooms = rooms;

            // --- Logic Data ---
            const totalRooms = rooms.length;
            
            // Filter jadwal HARI INI yang SUDAH DISETUJUI
            const today = new Date().toDateString();
            const activeToday = bookings.filter(b => {
                const s = String(b.status || b.Status).toLowerCase();
                const bDate = new Date(b.startTime || b.StartTime).toDateString();
                return (s === '1' || s === 'approved') && bDate === today;
            });

            // Urutkan jadwal
            activeToday.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

            // Icons
            const iconRoom = typeof Icons !== 'undefined' ? Icons.room('w-12 h-12 text-blue') : "ruangan";
            const iconCalendar = typeof Icons !== 'undefined' ? Icons.calendar('w-8 h-8') : "calendar";           
            // --- Render HTML ---
            let html = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in-up">
                
                <div class="md:col-span-2 bg-user text-white p-6 rounded-2xl shadow-lg flex justify-between items-center relative overflow-hidden">
                    <div class="absolute right-0 top-0 w-32 h-32 bg-white opacity-10 rounded-bl-full -mr-4 -mt-4"></div>
                    <div class="relative z-10">
                        <h3 class="text-2xl font-bold">Halo, User! 👋</h3>
                        <p class="opacity-90 mt-1 mb-4">Butuh tempat untuk meeting atau kegiatan hari ini?</p>
                        <a href="booking-form.html" class="inline-block bg-white text-user font-bold py-2.5 px-6 rounded-xl shadow-sm hover:bg-gray-100 hover:shadow-md transition">
                            + Booking Sekarang
                        </a>
                        <div class="mt-4 flex items-center text-sm text-gray-200">
                        Hindari Jadwal yang bentrok dengan melihat jadwal ruangan hari ini di bawah!
                        </div>
                    </div>
                </div>

                <a href="rooms.html" class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center hover:shadow-md transition group cursor-pointer relative overflow-hidden">
                    <div class="flex items-center space-x-4 mb-2">
                        <div class="absolute right-0 top-0 w-16 h-16 bg-blue-400 opacity-10 rounded-bl-full -mr-2 -mt-2 transition group-hover:scale-110"></div>
                        <div class="p-3 bg-blue-100 text-blue-600 rounded-full group-hover:bg-blue-200 transition">
                             ${iconRoom}
                        </div>
                        <div>
                            <p class="text-s text-gray-400 uppercase font-bold">Total Ruangan</p>
                            <h3 class="text-3xl font-bold text-main-dark">${totalRooms}</h3>
                        </div>
                    </div>
                </a>
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

            if (activeToday.length === 0) {
                html += `
                    <div class="text-center py-10 border-2 border-dashed border-gray-100 rounded-xl">
                        <p class="text-gray-400">Belum ada ruangan yang terpakai hari ini. <br> <span class="text-user font-bold">Semua ruangan kosong!</span></p>
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
                
                activeToday.forEach(b => {
                    const room = rooms.find(r => r.id === b.roomId);
                    const roomName = room ? room.name : 'Unknown';
                    const start = new Date(b.startTime).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'});
                    const end = new Date(b.endTime).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'});
                    
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
                                <button onclick="showBookingDetail(${b.id})" class="text-gray-400 hover:text-user transition">
                                    ${Icons.detail ? Icons.detail('w-5 h-5') : "Detail"}
                                </button>
                            </td>
                        </tr>
                    `;
                });

                html += `</div>`;
            }

            html += `</div>`;
            container.innerHTML = html;

        } catch (error) {
            console.error(error);
            container.innerHTML = `<div class="text-red-500 text-center">Gagal memuat data.</div>`;
        }
    }
};