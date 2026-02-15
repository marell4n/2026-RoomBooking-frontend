import { UserDashboard } from "./user";
import { AdminDashboard } from "./admin";
import { fetchAPI } from '../api.js';
import { Icons } from '../icons.js';
import { BookingModal } from "../component/BookingDetailModal.js";

document.addEventListener('DOMContentLoaded', () => {
    // 1. Siapkan komponen Shared
    renderHeader();

    // 2. Langsung Jalankan Dashboard sesuai Role
    const role = localStorage.getItem('userRole') || 'user';
    console.log("Role detected:", role);

    if (role === 'admin') {
        AdminDashboard.init();
    } else {
        UserDashboard.init();
    }
});

/**
 * Render Header Halaman (Judul & Tanggal)
 */
function renderHeader() {
    const headerContainer = document.getElementById('page-header');
    if (!headerContainer) return;

    const todayDate = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const role = localStorage.getItem('userRole') || 'user';
    
    // Custom Text berdasarkan Role
    const title = role === 'admin' ? 'Admin Dashboard' : 'User Dashboard';
    const subtitle = role === 'admin' ? 'Ringkasan aktivitas & persetujuan ruangan.' : 'Selamat datang, mau pinjam ruangan mana?';

    headerContainer.innerHTML = `
        <div>
            <h2 class="text-3xl font-bold text-main-dark capitalize tracking-tight">${title}</h2>
            <p class="text-gray-600 mt-1">${subtitle}</p>
        </div>
        <div class="hidden sm:flex text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm items-center gap-2 border border-gray-100">
            ${Icons.calendar ? Icons.calendar('w-4 h-4') : '📅'} 
            <span class="font-medium">${todayDate}</span>
        </div>
    `;
}