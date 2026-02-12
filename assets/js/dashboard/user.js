window.UserDashboard = {
    render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return; // Validasi container

        // Gunakan icon dari window.Icons jika ada, atau fallback ke emoji
        const iconRoom = typeof Icons !== 'undefined' ? Icons.room('w-12 h-12 text-white') : '🏢';
        const iconCalendar = typeof Icons !== 'undefined' ? Icons.calendar('w-8 h-8') : '📅';

        // Render HTML User (Layout Statis)
        container.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div class="bg-user text-white p-6 rounded-2xl shadow-lg flex justify-between items-center">
                    <div>
                        <h3 class="text-2xl font-bold">Halo, User! 👋</h3>
                        <p class="opacity-90 mt-1">Mau pinjam ruangan apa hari ini?</p>
                        <a href="rooms.html" class="inline-block mt-4 bg-white text-user font-bold py-2 px-4 rounded-lg shadow-sm hover:bg-gray-100 transition">
                            Cari Ruangan
                        </a>
                    </div>
                    <div class="bg-white/20 p-4 rounded-full">
                         ${iconRoom}
                    </div>
                </div>

                <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h4 class="font-bold text-gray-500 text-sm uppercase mb-4">Booking Saya (Aktif)</h4>
                    <div class="flex items-center space-x-4">
                        <div class="p-3 bg-indigo-100 text-indigo-600 rounded-full">
                             ${iconCalendar}
                        </div>
                        <div>
                            <h3 class="text-4xl font-bold text-main-dark" id="user-my-bookings">-</h3>
                            <p class="text-xs text-gray-400">Jadwal mendatang</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">
                <p>Fitur Maintenance.</p>
            </div>
        `;
    }
};