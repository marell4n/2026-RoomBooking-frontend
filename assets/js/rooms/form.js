import { fetchAPI } from "../api";

export const RoomForm = {
    openModal(id = null) {
        // Ambil data ruangan dari memory List jika Edit mode
        let room = null;
        if (id && window.allRooms && window.allRooms._data) {
            room = window.allRooms._data.find(r => (r.id || r.Id) === id);
        }

        const modalHTML = `
            <div id="room-modal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                <div class="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl">
                    <h3 class="text-xl font-bold mb-4">${id ? 'Edit Ruangan' : 'Tambah Ruangan'}</h3>
                    <form id="form-room" class="mb-4 mt-4">
                        <input type="hidden" id="room-id" value="${id || ''}">
                        <div class="mb-4">
                            Nama Ruangan:
                            <input type="text" id="room-name" placeholder="Nama Ruangan"
                                value="${room?.name || room?.Name || ''}"
                                class="w-full border p-2 rounded-lg" required>
                        </div>
                        <div class="mb-4">
                            Kapasitas:
                            <input type="number" id="room-capacity" placeholder="Kapasitas"
                                value="${room?.capacity || room?.Capacity || ''}"
                                class="w-full border p-2 rounded-lg" required>
                        </div>
                        <div class="mb-4">
                            Deskripsi: <span class="text-red-400 text-xs">*Berikan informasi fasilitas</span>
                            <textarea id="room-desc" placeholder="Deskripsi" class="w-full border p-2 rounded-lg">${room?.description || room?.Description || ''}</textarea>
                        </div>
                        <div class="flex gap-2">
                            <button type="button" id="btn-cancel-modal" class="grow border py-2 rounded-lg">Batal</button>
                            <button type="submit" class="grow bg-admin text-white py-2 rounded-lg font-bold">Simpan</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Submit form
        const form = document.getElementById('form-room');
        form.onsubmit = (e) => this.handleSubmit(e);

        // Tombol close & cancel
        const btnCancel = document.getElementById('btn-cancel-modal');
        if (btnCancel) btnCancel.onclick = () => this.closeModal();

        const btnClose = document.getElementById('btn-close-modal');
        if (btnClose) btnClose.onclick = () => this.closeModal();
        
        // Klik background untuk close
        const modal = document.getElementById('room-modal');
        if (modal) {
            modal.onclick = (e) => {
                if (e.target.id === 'room-modal') this.closeModal();
            };
        }
    },

    closeModal() {
        const modal = document.getElementById('room-modal');
        if (modal) modal.remove();
    },

    async handleSubmit(e) {
        e.preventDefault();

        const id = document.getElementById('room-id').value;
        const nameVal = document.getElementById('room-name').value;
        const capacityVal = document.getElementById('room-capacity').value;
        const descVal = document.getElementById('room-desc').value;

        // Siapkan payload
        const data = {
            name: nameVal,
            capacity: parseInt(capacityVal),
            description: descVal
        };

        // Jika edit, tambahkan ID ke body
        if(id) data.id = parseInt(id);

        const method = id ? 'PUT' : 'POST';
        const url = id ? `/rooms/${id}` : `/rooms`;

        try {
            await fetchAPI(url, {
                method: method,
                body: JSON.stringify(data)
            });

            alert(`Ruangan berhasil ${id ? 'diperbarui' : 'ditambahkan'}!`);
            this.closeModal();
            
            // Refresh list di halaman utama
            if(window.RoomList) window.RoomList.init('main-content');
            
        } catch (error) {
            console.error(error);
            alert('Terjadi kesalahan saat menyimpan ruangan.');
        }
    }
};