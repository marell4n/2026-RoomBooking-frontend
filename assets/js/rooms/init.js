document.addEventListener('DOMContentLoaded', () => {
    // 1. Render Header UI
    renderPageHeader();

    // 2. Setup Pencarian (Live Search)
    const searchInput = document.getElementById('search-room');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            if(window.RoomList) {
                RoomList.filter(e.target.value);
            }
        });
    } else {
        console.warn("Input search-room tidak ditemukan di DOM.");
    }

    // 3. Load Data Ruangan (Semua role butuh ini untuk melihat list)
    if (window.RoomList) {
        RoomList.init('main-content');
    } else {
        console.error("RoomList module not found.");
    }
});

function renderPageHeader() {
    const role = localStorage.getItem('userRole') || 'user';
    const header = document.getElementById('page-header');
    if (!header) return;

    // Tombol Add Room HANYA untuk Admin
    // Tombol ini memanggil fungsi di RoomForm.openModal()
    const addButton = role === 'admin' 
        ? `<button onclick="RoomForm.openModal()" class="bg-admin hover:bg-admin-hover text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-admin/20 transition flex items-center gap-2">
             <span>+</span> Tambah Ruangan
           </button>` 
        : '';

    header.innerHTML = `
        <div>
            <h2 class="text-3xl font-bold text-main-dark">Daftar Ruangan</h2>
            <p class="text-gray-500 mt-1">Cek fasilitas dan kapasitas ruangan.</p>
        </div>

        <div class="flex items-center gap-4 w-full md:w-auto">
            <div class="relative grow md:grow-0 md:w-64">
                <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    ${typeof Icons !== 'undefined' && Icons.detail ? Icons.detail('w-5 h-5') : "🔍"}
                </span>
                <input type="text" id="search-room" 
                    class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-user/50 outline-none transition bg-white" 
                    placeholder="Cari nama ruangan...">
            </div>
            ${addButton}
        </div>
    `;
}