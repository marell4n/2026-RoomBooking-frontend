window.RoomList = {
    _data: [],
    // Fungsi render tetap sama, tapi kita pastikan data disimpan ke window.allRooms
    async init(containerId = 'main-content') {
        const container = document.getElementById(containerId);
        if(!container) return;

        container.innerHTML = `<div class="text-center py-20 text-gray-400">Memuat data ruangan...</div>`;

        try {
            const rooms = await fetchAPI('/rooms');
            if (!rooms || !Array.isArray(rooms)) {
                container.innerHTML = `<div class="text-center py-20 text-red-400">Gagal memuat data.</div>`;
                return;
            }

            this._data = rooms;
            this.render(rooms, containerId);
        } catch (e) {
            console.error(e);
            container.innerHTML = `<div class="text-center py-20 text-red-400">Koneksi Error.</div>`;
        }
    },

    // Fungsi memfilter data
    filter(keyword) {
        const lowerKeyword = keyword.toLowerCase();
        const filtered = this._data.filter(room => {
            const name = room.name || room.Name || ''; 
            return name.toLowerCase().includes(lowerKeyword);
        });
        this.render(filtered, 'main-content');
    },

    // Logika Toggle Read More (UI Only)
    toggleDesc(id) {
        const descEl = document.getElementById(`desc-${id}`);
        const btnEl = document.getElementById(`btn-read-${id}`);
        
        if (!descEl || !btnEl) return;

        if (descEl.classList.contains('line-clamp-3')) {
            descEl.classList.remove('line-clamp-3');
            btnEl.innerText = 'Show Less';
        } else {
            descEl.classList.add('line-clamp-3');
            btnEl.innerText = 'Read More';
        }
    },

    // Pisahkan logika tampilan ke fungsi sendiri agar bisa dipanggil berulang kali
    render(rooms, containerId) {
        const container = document.getElementById(containerId);
        const role = localStorage.getItem('userRole') || 'user';

        if (rooms.length === 0) {
            container.innerHTML = `
                <div class="text-center py-20 text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl">
                    ${typeof Icons !== 'undefined' && Icons.empty ? Icons.empty('mx-auto mb-2 w-10 h-10 opacity-50') : '🚫'}
                    <p>Ruangan tidak ditemukan.</p>
                </div>`;
            return;
        }

        let html = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">`;

        rooms.forEach(room => {
            const id = room.id || room.Id;
            const name = room.name || room.Name || 'Tanpa Nama';
            const capacity = room.capacity || room.Capacity || '-';
            const description = room.description || room.Description || 'Tidak ada deskripsi.';
            const isLong = description.length > 100; // Batas karakter untuk read more
            
            html += `
                <div class="relative pb-16 h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group">
                    <div class="p-6">
                        <div class="flex justify-between items-start mb-3">
                            <h3 class="text-xl font-bold text-main-dark group-hover:text-user transition">${name}</h3>
                            <span class="bg-user/10 text-user text-xs font-bold px-2 py-1 rounded-lg">Cap: ${capacity}</span>
                        </div>

                        <div>
                            <p id="desc-${id}" class="text-gray-500 text-sm leading-relaxed transition-all duration-300 ${isLong ? 'line-clamp-3' : ''}">
                                ${description.replace(/\n/g, '<br>')}
                            </p>
                            ${isLong ? `
                                <button onclick="RoomList.toggleDesc(${id})" id="btn-read-${id}" class="text-xs text-user font-bold hover:underline mt-1 focus:outline-none">
                                    Read More
                                </button>
                            ` : ''}
                        </div>

                        <div class="absolute bottom-4 right-4 flex gap-2 z-10">
                            ${role === 'admin' ? `
                                <button onclick="RoomList.openModal(${id})" class="p-2.5 border border-gray-100 rounded-xl hover:bg-gray-100 transition">Edit</button>
                                <button onclick="RoomList.delete(${id})" class="p-2.5 border border-red-50 bg-red-100 text-red-500 rounded-xl hover:bg-red-50 transition">Delete</button>
                            ` : ''}
                        </div>
                    </div>
                </div>`;
        });
        
        html += `</div>`;
        container.innerHTML = html;
    }
};