const TMDB_API_KEY = "f409e7b13839f996f020b829c2764a1f"; 
const BASE_URL = "https://api.themoviedb.org/3";

// Fungsi fetch global yang dioptimasi untuk SSG dengan API Key biasa
export async function fetchTMDB(endpoint) {
  try {
    // Menyisipkan api_key ke dalam URL parameter bawaan TMDB
    const separator = endpoint.includes('?') ? '&' : '?';
    const url = `${BASE_URL}${endpoint}${separator}api_key=${TMDB_API_KEY}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json'
      },
      // 🟢 KUNCI UTAMA SSG: Data disimpan di cache server selama 1 hari (86400 detik).
      // Robot Google US/LatAm bisa membaca halaman secara instan tanpa membebani limit API TMDB Anda!
      next: { revalidate: 86400 }
    });

    if (!res.ok) {
      throw new Error(`TMDB error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Fetch TMDB Error:", error);
    return null;
  }
}

// Helper untuk mengambil URL poster/banner film
export function getImageUrl(path, size = 'w500') {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : 'https://via.placeholder.com/342x513?text=No+Poster';
}

// Helper penting untuk membuat Slug URL ramah SEO pasar Global (US/Eropa)
export function createSlug(title) {
  if (!title) return 'movie';
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Hapus karakter spesial
    .replace(/\s+/g, '-')         // Spasi diubah jadi tanda hubung
    .replace(/-+/g, '-');         // Cegah double strip ---
}