import './../../src/style.css';

export const Navbar = {
    renderNavbar(role) {
        const navbarContainer = document.getElementById('navbar-container');
        if (!navbarContainer) return;
        
        const navBgColor = role === 'admin' ? 'bg-admin' : 'bg-user';
        const menuHoverColor = role === 'admin' ? 'hover:bg-admin-hover' : 'hover:bg-user-hover';

        // Menu Item (Admin bisa lihat menu Approval)
        let menuItems = `
            <a href="index.html" class="block mt-4 lg:inline-block lg:mt-0 text-white ${menuHoverColor} px-3 py-2 rounded mr-0">Dashboard</a>
            <a href="rooms.html" class="block mt-4 lg:inline-block lg:mt-0 text-white ${menuHoverColor} px-3 py-2 rounded mr-0">Rooms</a>
            <a href="bookings.html" class="block mt-4 lg:inline-block lg:mt-0 text-white ${menuHoverColor} px-3 py-2 rounded mr-0">My Bookings</a>
        `;

        if (role === 'admin') {
            menuItems += `
                <a href="admin-approval.html" class="block mt-4 lg:inline-block lg:mt-0 text-white bg-admin-hover font-bold px-3 py-2 rounded mr-4">Admin Approval</a>
            `;
        }

        // HTML Navbar
        navbarContainer.innerHTML = `
            <nav class="${navBgColor} p-4 shadow-md transition-colors duration-500">
                <div class="container mx-auto flex items-center justify-between flex-wrap p-4">
                    <div class="flex items-center text-white mr-10">
                        <div class="flex flex-col items-center shrink-0 mr-3">
                            <span class="font-logo text-4xl tracking-tight">RUKA</span>
                            <span class="text-xs -mt-1 italic">Ruang Kampus</span>
                        </div>
                        <div class="text-xs opacity-75">(${role.toUpperCase()})</div>
                    </div>
                    

                    <div class="block lg:hidden">
                        <button onclick="toggleMenu()" class="flex items-center px-3 py-2 border rounded text-white border-white hover:text-white hover:border-white">
                            <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
                        </button>
                    </div>

                    <div id="nav-content" class="w-full grow lg:flex lg:items-center lg:w-auto hidden">
                        <div class="text-sm lg:grow">
                            ${menuItems}
                        </div>
                        
                        <div class="mt-4 lg:mt-0">
                            <span class="text-white text-xs mr-2 opacity-80">Switch Role:</span>
                            <button onclick="switchRole('user')" class="${role === 'user' ? 'bg-white text-user' : 'bg-transparent border border-white text-white'} text-xs font-bold py-1 px-3 rounded-l focus:outline-none">
                                User
                            </button>
                            <button onclick="switchRole('admin')" class="${role === 'admin' ? 'bg-white text-admin' : 'bg-transparent border border-white text-white'} text-xs font-bold py-1 px-3 rounded-r focus:outline-none">
                                Admin
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        `;
    }
};

// Fungsi toggle menu untuk mobile
window.toggleMenu = function() {
    const navContent = document.getElementById('nav-content');
    navContent.classList.toggle('hidden');
};