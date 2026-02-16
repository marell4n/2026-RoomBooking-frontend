import './style.css';
// Import Global Scripts (Script yang dipakai di semua halaman)
import './utils/api.js';
import './utils/icons.js';
import './utils/pagination-helper.js';

import { Navbar } from './component/navbar.js';
import { Footer } from './component/footer.js';

// Render Navbar, Footer, Ganti Role
document.addEventListener('DOMContentLoaded', () => {
    init();
});

function init() {
    const currentRole = localStorage.getItem('userRole') || 'user'; // Default User
    Navbar.renderNavbar(currentRole);
    Footer.renderFooter();
    applyTheme(currentRole);

}

// Fungsi Mengganti Role
window.switchRole = function(role) {
    localStorage.setItem('userRole', role);
    location.reload(); // Refresh halaman agar tema berubah
};

function applyTheme(role) {
    console.log(`Theme applied for: ${role}`);
}

console.log('Vite + Tailwind sudah jalan di semua halaman!');