// Konfigurasi URL API Backend
// Ganti port '5017' sesuai dengan port backend (cek di launchSettings.json atau saat run backend)
const API_BASE_URL = "http://localhost:5017/api"; 

// Helper untuk fetch data dengan error handling
async function fetchAPI(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Fetch API Error:", error);
        return null;
    }
}