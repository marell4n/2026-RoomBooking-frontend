window.RoomForm = {
    openModal(id = null) {
        // Ambil data ruangan dari memory List jika Edit mode
        const room = id ? window.allRooms._data : null;

        const modalHTML = `
            <div id="room-modal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                <div class="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl">
                    <h3 class="text-xl font-bold mb-4">${id ? 'Edit Ruangan' : 'Tambah Ruangan'}</h3>
                    <form id="form-room" class="mb-4 mt-4">
                        <input type="hidden" id="room-id" value="${id || ''}">
                        <div class="mb-4">
                            Nama Ruangan:
                            <input type="text" id="room-name" placeholder="Nama Ruangan" value="${room?.name || ''}" class="w-full border p-2 rounded-lg" required>
                        </div>
                        <div class="mb-4">
                            Kapasitas:
                            <input type="number" id="room-capacity" placeholder="Kapasitas" value="${room?.capacity || ''}" class="w-full border p-2 rounded-lg" required>
                        </div>
                        <div class=>
                            Deskripsi: <span class="text-red-400 text-xs">*Berikan informasi fasilitas</span>
                            <textarea id="room-desc" placeholder="Deskripsi" class="w-full border p-2 rounded-lg">${room?.description || ''}</textarea>
                        </div>
                        <div class="flex gap-2">
                            <button type="button" onclick="RoomForm.closeModal()" class="flex-grow border py-2 rounded-lg">Batal</button>
                            <button type="submit" class="flex-grow bg-admin text-white py-2 rounded-lg font-bold">Simpan</button>
                        </div>
                    </form>
                </div>
            </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.getElementById('form-room').onsubmit = this.handleSubmit;
        document.getElementById('room-modal').addEventListener('click', (e) => {
            if (e.target.id === 'room-modal') this.closeModal();
        });
    },

    closeModal() {
        document.getElementById('room-modal')?.remove();
    },

    async handleSubmit(e) {
        e.preventDefault();
        const id = document.getElementById('room-id').value;
        const data = {
            name: document.getElementById('room-name').value,
            capacity: parseInt(document.getElementById('room-capacity').value),
            description: document.getElementById('room-desc').value
        };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_BASE_URL}/rooms/${id}` : `${API_BASE_URL}/rooms`;
        if(id) data.id = parseInt(id);

        try {
            const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            alert(`Ruangan berhasil ${id ? 'diperbarui' : 'ditambahkan'}!`);
            RoomForm.closeModal();
            if(window.RoomList) window.RoomList.init();
        } else {
            alert('Gagal menyimpan ruangan.');
        }   
        } catch (error) {
            console.error(error);
            alert('Terjadi kesalahan saat menyimpan ruangan.');
        }
    },

    async delete(id) {
        if (!confirm('Apakah Anda yakin ingin menghapus ruangan ini secara permanen?')) return;
        
        try {
            const res = await fetch(`${API_BASE_URL}/rooms/${id}`, { method: 'DELETE' });
            if (res.ok) {
                alert("Ruangan berhasil dihapus.");
                if(window.RoomList) window.RoomList.init(); // Refresh List
            } else {
                alert("Gagal menghapus ruangan. Mungkin ruangan sedang dipakai.");
            }
        } catch (error) {
            console.error(error);
            alert("Error koneksi.");
        }
    }
};