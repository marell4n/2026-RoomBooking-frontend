import { fetchAPI } from "../api";
import { Icons } from "../icons";
import { RoomForm } from "./form";

const RoomList = {
    _data: [], // Data mentah semua ruangan

    async init(containerId) {
        // Render Header Halaman
        this.renderHeader();

        const container = document.getElementById(containerId);
        if(!container) return;

        container.innerHTML = `<div class="text-center py-20 text-gray-400">Memuat data ruangan...</div>`;

        try {
            const rooms = await fetchAPI('/rooms');

            if (!rooms || !Array.isArray(rooms)) {
                container.innerHTML = `<div class="text-center py-20 text-red-400">Gagal memuat data.</div>`;
                return;
            }

            // Simpan data ke memori lokal
            this._data = rooms;

            // Render Grid Ruangan
            this.renderGrid(rooms, containerId);
            window.allRooms = { _data: rooms }; // Agar form.js bisa akses data ini

            console.log("Data Ruangan Loaded:", window.allRooms);

            // Render Grid Ruangan
            this.renderGrid(rooms, containerId);

            // Live search
            const searchInput = document.getElementById('search-room'); 
            if (searchInput) {
                // Hapus event listener lama agar tidak double (opsional tapi bagus)
                const newSearch = searchInput.cloneNode(true);
                searchInput.parentNode.replaceChild(newSearch, searchInput);
                
                newSearch.addEventListener('input', (e) => {
                    this.filter(e.target.value, containerId);
                });
                // Focus balik ke input setelah replace
                newSearch.focus();
            }

        } catch (e) {
            console.error("RoomList Error:", e);
            container.innerHTML = `<div class="text-center py-20 text-red-400">Koneksi Error.</div>`;
        }
    },

    renderHeader() {
        const headerContainer = document.getElementById('page-header');
        if (!headerContainer) return;

        const role = localStorage.getItem('userRole') || 'user';

        headerContainer.innerHTML = `
            <div class="mb-4 md:mb-0">
                <h2 class="text-3xl font-bold text-main-dark">Daftar Ruangan</h2>
                <p class="text-gray-500 mt-1">Cari dan pilih ruangan yang sesuai kebutuhanmu.</p>
            </div>

            <div class="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full md:w-auto">
                <div class="relative grow md:grow-0 md:w-64">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                        ${typeof Icons !== 'undefined' && Icons.detail ? Icons.detail('w-5 h-5') : "🔍"}
                    </span>
                    <input type="text" id="search-room" 
                        class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition bg-white text-sm" 
                        placeholder="Cari nama ruangan...">
                </div>

                ${role === 'admin' ? `
                <button onclick="RoomForm.openModal()" class="bg-admin text-m hover:bg-admin-hover text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-admin/20 transition flex items-center gap-2">
                    + Tambah Ruangan
                </button>
                ` : ''}
            </div>
        `;
    },
    
    // Fungsi memfilter data
    filter(keyword, containerId) {
        const lowerKeyword = keyword.toLowerCase();
        const filtered = this._data.filter(room => {
            const name = room.name || room.Name || ''; 
            return name.toLowerCase().includes(lowerKeyword);
        });
        this.renderGrid(filtered, containerId);
    },

    renderGrid(rooms, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const role = localStorage.getItem('userRole') || 'user';

        if (rooms.length === 0) {
            container.innerHTML = `
                <div class="text-center py-20 text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl">
                    <p>Tidak ada ruangan yang ditemukan.</p>
                </div>`;
                return;
        }

        let html = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">`;

        rooms.forEach(room => {
            const id = room.id || room.Id;
            const name = room.name || room.Name || 'Tanpa Nama';
            const capacity = room.capacity || room.Capacity || '-';
            const description = room.description || room.Description || 'Tidak ada deskripsi.';

            // Logika Read More
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
                                <button onclick="RoomForm.openModal(${id})" class="p-2.5 border border-gray-100 rounded-xl hover:bg-gray-100 transition">Edit</button>
                                <button onclick="RoomList.delete(${id})" class="p-2.5 border border-red-50 bg-red-100 text-red-500 rounded-xl hover:bg-red-50 transition">Delete</button>
                            ` : ''}
                        </div>
                    </div>
                </div>`;
        });

        html += `</div>`;
        container.innerHTML = html;
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

    async delete(id) {
        if (!confirm('Apakah Anda yakin ingin menghapus ruangan ini secara permanen?')) return;
        
        try {
            await fetchAPI(`/rooms/${id}`, { method: 'DELETE' });
            alert("Ruangan berhasil dihapus.");
            this.init('main-content'); // Refresh List
        } catch (error) {
            console.error(error);
            alert("Gagal menghapus ruangan.");
        }
    }
};

// Expose ke window agar bisa dipanggil dari HTML
window.RoomList = RoomList;

// Expose RoomForm ke window agar bisa dipanggil dari HTML
window.RoomForm = RoomForm;

// Inisialisasi saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
    RoomList.init('main-content');
});