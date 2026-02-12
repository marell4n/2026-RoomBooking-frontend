window.AdminDashboard = { 
    render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Render HTML Saja (Tanpa Load Data)
        container.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                    <div class="p-4 rounded-full bg-blue-100 text-blue-600 mr-4">${typeof Icons !== 'undefined' ? Icons.room('w-8 h-8') : '🏢'}</div>
                    <div>
                        <p class="text-gray-500 text-sm font-medium">Total Ruangan</p>
                        <h3 class="text-3xl font-bold text-gray-800">-</h3>
                    </div>
                </div>
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                    <div class="p-4 rounded-full bg-yellow-100 text-yellow-600 mr-4">${typeof Icons !== 'undefined' ? Icons.clock('w-8 h-8') : '⏳'}</div>
                    <div>
                        <p class="text-gray-500 text-sm font-medium">Menunggu Approval</p>
                        <h3 class="text-3xl font-bold text-gray-800">-</h3>
                    </div>
                </div>
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                    <div class="p-4 rounded-full bg-admin/20 text-admin mr-4">${typeof Icons !== 'undefined' ? Icons.calendar('w-8 h-8') : '📅'}</div>
                    <div>
                        <p class="text-gray-500 text-sm font-medium">Disetujui Hari Ini</p>
                        <h3 class="text-3xl font-bold text-gray-800">-</h3>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">
                <p>Fitur Maintenance.</p>
            </div>
        `;
    }
};