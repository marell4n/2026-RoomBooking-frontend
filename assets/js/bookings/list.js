document.addEventListener('DOMContentLoaded', () => {
    BookingList.render('booking-list-container');
});

window.BookingList = {
    async render(containerId) {
        const container = document.getElementById(containerId);
        
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

            // Sort descending (terbaru diatas)
            bookings.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

            let html = '';
            bookings.forEach(booking => {
                const room = rooms.find(r => r.id === booking.roomId);
                const roomName = room ? room.name : 'Unknown Room';

                // Mapping status ke badge
                const rawStatus = booking.status || booking.Status || 'Unknown';
                const statusKey = String(rawStatus).toLowerCase();
                
                // Format Date
                const start = new Date(booking.startTime);
                const end = new Date(booking.endTime);
                const dateStr = start.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
                const timeStr = `${start.toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})} - ${end.toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})}`;

                // Status Badge
                const statusConfig = {
                    'pending': { text: 'Pending', class: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
                    'approved': { text: 'Approved', class: 'bg-green-100 text-green-800 border-green-200' },
                    'rejected': { text: 'Rejected', class: 'bg-red-100 text-red-800 border-red-200' },
                    'cancelled': { text: 'Cancelled', class: 'bg-gray-100 text-gray-600 border-gray-200' }
                };
                const status = statusConfig[statusKey] || { text: rawStatus, class: 'bg-gray-100 text-gray-500' };

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
                        <p class="mt-2 text-gray-600 text-sm italic">"${booking.purpose}"</p>
                    </div>
                    
                    <div class="flex gap-2">
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

    async delete(id) {
        if(!confirm('Batalkan booking ini?')) return;
        const res = await fetch(`${API_BASE_URL}/bookings/${id}`, { method: 'DELETE' });
        if(res.ok) this.render('booking-list-container');
    }
};