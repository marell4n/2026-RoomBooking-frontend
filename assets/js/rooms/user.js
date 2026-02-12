window.RoomUser = {
    // Fungsi render tetap sama, tapi kita pastikan data disimpan ke window.allRooms
    async renderList(containerId) {
        const container = document.getElementById(containerId);
        const rooms = await fetchAPI('/rooms');
        
        if (!rooms) {
            container.innerHTML = `<div class="text-center py-20 text-red-400">Gagal memuat data.</div>`;
            return;
        }

        window.allRooms = rooms; // Simpan data asli ke memory
        this.displayRooms(rooms, containerId);
    },

    // Fungsi memfilter data
    filterList(keyword) {
        const filtered = window.allRooms.filter(room => 
            room.name.toLowerCase().includes(keyword.toLowerCase())
        );
        this.displayRooms(filtered, 'main-content');
    },

    // Pisahkan logika tampilan ke fungsi sendiri agar bisa dipanggil berulang kali
    displayRooms(rooms, containerId) {
        const container = document.getElementById(containerId);
        const role = localStorage.getItem('userRole') || 'user';

        if (rooms.length === 0) {
            container.innerHTML = `
                <div class="text-center py-20 text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl">
                    ${Icons.empty ? Icons.empty('mx-auto mb-2 w-10 h-10') : '🚫'}
                    <p>Ruangan tidak ditemukan.</p>
                </div>`;
            return;
        }

        let html = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">`;
        rooms.forEach(room => {
            html += `
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group">
                    <div class="p-6">
                        <div class="flex justify-between items-start mb-3">
                            <h3 class="text-xl font-bold text-main-dark group-hover:text-user transition">${room.name}</h3>
                            <span class="bg-user/10 text-user text-xs font-bold px-2 py-1 rounded-lg">Cap: ${room.capacity}</span>
                        </div>
                        <p class="text-gray-500 text-sm mb-6 line-clamp-2">${room.description || 'Tidak ada deskripsi.'}</p>
                        <div class="flex gap-2">
                            <button class="flex-grow bg-main-light hover:bg-gray-200 py-2.5 rounded-xl font-bold text-sm transition">Detail</button>
                            ${role === 'admin' ? `
                                <button onclick="RoomAdmin.openModal(${room.id})" class="p-2.5 border border-gray-100 rounded-xl hover:bg-gray-50 transition" title="Edit">✎</button>
                                <button onclick="RoomAdmin.delete(${room.id})" class="p-2.5 border border-red-50 text-red-500 rounded-xl hover:bg-red-50 transition" title="Hapus">🗑</button>
                            ` : ''}
                        </div>
                    </div>
                </div>`;
        });
        html += `</div>`;
        container.innerHTML = html;
    }
};