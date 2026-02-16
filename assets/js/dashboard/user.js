// Import library atau modul yang dibutuhkan
import { fetchAPI } from '../api.js';
import { Icons } from '../icons.js';
import { TodaySchedule } from '../../../src/component/today-schedule.js';

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

            // Icons
            const iconRoom = typeof Icons !== 'undefined' ? Icons.room('w-12 h-12 text-blue') : "ruangan";          
            
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
            
            ${TodaySchedule.render(bookings, rooms)}
            `;

            container.innerHTML = html;

            // Jalankan pagination
            setTimeout(() => {
                TodaySchedule.initPagination();
            }, 0);

        } catch (error) {
            console.error(error);
            container.innerHTML = `<div class="text-red-500 text-center">Gagal memuat data.</div>`;
        }
    }
};