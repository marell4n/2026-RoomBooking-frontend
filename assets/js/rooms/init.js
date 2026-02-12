document.addEventListener('DOMContentLoaded', () => {
    // 1. Render Header
    const role = localStorage.getItem('userRole') || 'user';
    const header = document.getElementById('page-header');
    header.innerHTML = `
        <div>
            <h2 class="text-3xl font-bold">Daftar Ruangan</h2>
        </div>

        <div class="flex flex-grow max-w-md gap-2">
                <div class="relative flex-grow">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                        ${Icons.detail ? Icons.detail('w-5 h-5') : "Magnifying Glass"}
                    </span>
                    <input type="text" id="search-room" 
                        class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-user/50 outline-none transition" 
                        placeholder="Cari nama ruangan...">
                </div>

        ${role === 'admin' ? `<button onclick="RoomAdmin.openModal()" class="bg-admin text-white px-6 py-2 rounded-xl font-bold">Add Room</button>` : ''}
    `;

    // Pasang Event Listener untuk pencarian (Live Search)
    const searchInput = document.getElementById('search-room');
    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value;
        RoomUser.filterList(keyword);
    });

    // 2. Load Data
    RoomUser.renderList('main-content');
});