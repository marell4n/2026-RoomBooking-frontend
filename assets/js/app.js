document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    const currentRole = localStorage.getItem('userRole') || 'user'; // Default User
    renderNavbar(currentRole);
    applyTheme(currentRole);
}

// Fungsi Mengganti Role
window.switchRole = function(role) {
    localStorage.setItem('userRole', role);
    location.reload(); // Refresh halaman agar tema berubah
};

function applyTheme(role) {
    // Logika tambahan jika ingin mengubah background body dsb
    // Saat ini warna ditangani oleh class Tailwind di Navbar
    console.log(`Theme applied for: ${role}`);
}

function renderNavbar(role) {
    const navbarContainer = document.getElementById('navbar-container');
    if (!navbarContainer) return;
    
    const navBgColor = role === 'admin' ? 'bg-[#E38792]' : 'bg-[#9DAD71]';
    const menuHoverColor = role === 'admin' ? 'hover:bg-[#c96f79]' : 'hover:bg-[#869660]';

    // Menu Item (Admin bisa lihat menu Approval)
    let menuItems = `
        <a href="index.html" class="block mt-4 lg:inline-block lg:mt-0 text-white ${menuHoverColor} px-3 py-2 rounded mr-4">Dashboard</a>
        <a href="rooms.html" class="block mt-4 lg:inline-block lg:mt-0 text-white ${menuHoverColor} px-3 py-2 rounded mr-4">Rooms</a>
        <a href="bookings.html" class="block mt-4 lg:inline-block lg:mt-0 text-white ${menuHoverColor} px-3 py-2 rounded mr-4">My Bookings</a>
    `;

    if (role === 'admin') {
        menuItems += `
            <a href="admin-approval.html" class="block mt-4 lg:inline-block lg:mt-0 text-white font-bold px-3 py-2 rounded mr-4">Admin Approval</a>
        `;
    }

    // HTML Navbar
    navbarContainer.innerHTML = `
        <nav class="${navBgColor} p-4 shadow-md transition-colors duration-500">
            <div class="container mx-auto flex items-center justify-between flex-wrap">
                <div class="flex items-center flex-shrink-0 text-white mr-6">
                    <span class="font-bold text-xl tracking-tight">RoomBooking <span class="text-xs opacity-75">(${role.toUpperCase()})</span></span>
                </div>

                <div class="block lg:hidden">
                    <button onclick="toggleMenu()" class="flex items-center px-3 py-2 border rounded text-white border-white hover:text-white hover:border-white">
                        <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
                    </button>
                </div>

                <div id="nav-content" class="w-full block flex-grow lg:flex lg:items-center lg:w-auto hidden">
                    <div class="text-sm lg:flex-grow">
                        ${menuItems}
                    </div>
                    
                    <div class="mt-4 lg:mt-0">
                        <span class="text-white text-xs mr-2 opacity-80">Switch Role:</span>
                        <button onclick="switchRole('user')" class="${role === 'user' ? 'bg-white text-[#9DAD71]' : 'bg-transparent border border-white text-white'} text-xs font-bold py-1 px-3 rounded-l focus:outline-none">
                            User
                        </button>
                        <button onclick="switchRole('admin')" class="${role === 'admin' ? 'bg-white text-[#E38792]' : 'bg-transparent border border-white text-white'} text-xs font-bold py-1 px-3 rounded-r focus:outline-none">
                            Admin
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    `;
}

// Fungsi toggle menu untuk mobile
window.toggleMenu = function() {
    const navContent = document.getElementById('nav-content');
    navContent.classList.toggle('hidden');
}