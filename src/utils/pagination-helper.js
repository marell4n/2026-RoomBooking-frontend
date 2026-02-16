import Pagination from 'tui-pagination';

export const PaginationHelper = (containerId, totalItems, itemsPerPage, onPageChange) => {
    const container = document.getElementById(containerId);
    if (!container) return null;

    const role = localStorage.getItem('userRole') || 'user';
    container.innerHTML = ''; // Clear existing pagination

    const instance = new Pagination(container, {
        totalItems: totalItems,
        itemsPerPage: itemsPerPage,
        visiblePages: 5,
        centerAlign: true,
        template: {
            // Tombol Halaman
            page: `<a href="#" class="tui-page-btn px-3 py-2 mx-1 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 text-${role} transition">{{page}}</a>`,
            
            // Tombol Halaman Aktif
            currentPage: `<strong class="tui-page-btn tui-is-selected px-3 py-2 mx-1 bg-main text-${role} border border-main rounded-lg shadow-md">{{page}}</strong>`,
            
            // Tombol Next/Prev/First/Last
            moveButton: ({type}) => {
                let label = '';
                if (type === 'first') label = '«';
                else if (type === 'last') label = '»';
                else if (type === 'prev') label = '>';
                else if (type === 'next') label = '>';

                return `<a href="#" class="tui-page-btn tui-${type} px-3 py-2 mx-1 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-${role} transition">${label}</a>`;
            },

            // Tombol Next/Prev saat Disabled
            disabledMoveButton: ({type}) => {
                let label = '';
                if (type === 'first') label = '«';
                else if (type === 'last') label = '»';
                else if (type === 'prev') label = '<';
                else if (type === 'next') label = '>';

                return `<span class="tui-page-btn tui-is-disabled tui-${type} px-3 py-2 mx-1 bg-gray-100 border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed">${label}</span>`;
            },
            
            moreButton: '<a href="#" class="tui-page-btn tui-{{type}}-is-ellip px-3 py-2 mx-1 text-gray-400">...</a>'
        }
    });

    // Event Listener (klik angka halaman)
    instance.on('afterMove', (event) => {
        const currentPage = event.page;
        onPageChange(currentPage); // Panggil fungsi render ulang data
    });

    return instance;
};
