// Konfigurasi URL API Backend
// Ganti port '5017' sesuai dengan port backend kamu
const API_BASE_URL = "http://localhost:5017/api"; 

// Fungsi helper untuk melakukan fetch ke API dengan error handling dasar
window.fetchAPI = async (endpoint, options = {}) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: { 
            'Content-Type': 'application/json', // Default kirim JSON
            ...options.headers 
        }
    });

    if (res.status === 204) return true; // Sukses delete/no-content
    
    // Coba return JSON, kalau gagal (misal server error text) return null/error obj
    try {
        const data = await res.json();
        return res.ok ? data : Promise.reject(data); // Kalau !ok, lempar ke catch
    } catch (e) {
        return res.ok ? {} : Promise.reject({ title: res.statusText });
    }
};

// Expose ke Global Window agar bisa dibaca file lain
window.fetchAPI = fetchAPI;
window.API_BASE_URL = API_BASE_URL;