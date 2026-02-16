export const Footer = {
    renderFooter() {
        const container = document.getElementById('footer-container');
        if (!container) return;

        const html = `
            <div class="bg-main-dark text-main-light text-center py-4 mt-auto">
                <p>© 2026 RUKA - Ruang Kampus Booking System. All rights reserved.</p>
            </div>
        `;

        container.innerHTML = html;
    }
};