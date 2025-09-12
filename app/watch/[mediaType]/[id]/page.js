// app/watch/[mediaType]/[id]/page.js
// PASTIKAN TIDAK ADA baris 'use client' di sini.
import { notFound } from 'next/navigation';
import WatchClient from './WatchClient';

// Konfigurasi API
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY; // <-- ISI DENGAN API KEY ANDA
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_API_URL;

// ====================================================================================
// FUNGSI UNTUK MENDAPATKAN DATA (di sisi server)
// ====================================================================================
async function getMediaDetails(mediaType, id) {
  const res = await fetch(`${BASE_URL}/${mediaType}/${id}?api_key=${API_KEY}`);
  if (!res.ok) {
    // Jika gagal, navigasi ke halaman 404
    notFound();
  }
  return res.json();
}

// Fungsi baru untuk mendapatkan daftar statis dari TMDB
async function getStaticListMedia(listId) {
  const res = await fetch(`${BASE_URL}/list/${listId}?api_key=${API_KEY}`);
  if (!res.ok) {
    // Jika gagal, kembalikan array kosong
    return { items: [] };
  }
  return res.json();
}

// ====================================================================================
// KOMPONEN UTAMA HALAMAN PLAYER (SERVER COMPONENT)
// ====================================================================================
export default async function Page({ params }) {
  // PERBAIKAN: Gunakan 'await params' untuk mengatasi error Next.js
  const { mediaType, id } = await params;

  try {
    const [detailsData, staticListData] = await Promise.all([
      getMediaDetails(mediaType, id),
      // Menggunakan daftar statis TMDB dengan ID 143347
      getStaticListMedia(143347),
    ]);

    // Meneruskan semua data yang diperlukan ke komponen klien
    return (
      <WatchClient
        mediaType={mediaType}
        id={id}
        initialDetails={detailsData}
        initialSimilarMedia={staticListData.items}
      />
    );
  } catch (error) {
    console.error("Gagal mengambil data di sisi server:", error);
    notFound();
  }
}

// ====================================================================================
// FUNGSI UNTUK MENDAPATKAN METADATA DINAMIS (Penting untuk SEO)
// ====================================================================================
export async function generateMetadata({ params }) {
  // PERBAIKAN: Gunakan 'await params' untuk mengatasi error Next.js
  const { mediaType, id } = await params;

  const res = await fetch(`${BASE_URL}/${mediaType}/${id}?api_key=${API_KEY}`);
  const details = res.ok ? await res.json() : null;

  if (!details) {
    return {};
  }

  const title = `${details.title || details.name} | Cine Visio`;
  const description = details.overview || 'Your free high quality streaming center for movies and TV shows.';
  const imageUrl = details.poster_path
    ? `https://image.tmdb.org/t/p/original${details.poster_path}`
    : 'https://placehold.co/1200x630/000000/FFFFFF?text=Cine-Visio';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://cinevisio.netlify.app/${mediaType}/${id}`,
      siteName: 'Cine Visio',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@WatchStream123',
      creator: '@WatchStream123',
      title,
      description,
      images: [imageUrl],
    },
  };
}
