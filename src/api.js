const TMDB_API_KEY = "f409e7b13839f996f020b829c2764a1f"; 
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export async function fetchTMDB(endpoint) {
  const url = `${TMDB_BASE_URL}${endpoint}${endpoint.includes("?") ? "&" : "?"}api_key=${TMDB_API_KEY}`;
  
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 }, // Cache 1 jam demi performa ngebut
    });

    if (!res.ok) {
      // Lempar error murni tanpa perlu console.error di sini agar tidak membanjiri terminal
      throw new Error(`TMDB error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    // Teruskan error ke pemanggil (biar dicatch oleh fetchSafeTMDB secara senyap jika 404)
    throw error;
  }
}

export function getImageUrl(path, size = "w500") {
  if (!path) return "https://via.placeholder.com/500x750?text=No+Image";
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function createSlug(text) {
  if (!text) return "video";
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")           // Ganti spasi dengan tanda -
    .replace(/[^\w\-]+/g, "")       // Hapus karakter aneh
    .replace(/\-\-+/g, "-")         // Ganti tanda double -- dengan single -
    .replace(/^-+/, "")             // Potong tanda - di awal teks
    .replace(/-+$/, "");            // Potong tanda - di akhir teks
}