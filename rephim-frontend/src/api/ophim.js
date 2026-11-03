/** @typedef {import('./ophim.types').OphimHomeResponse} OphimHomeResponse */
/** @typedef {import('./ophim.types').OphimMovieDetailResponse} OphimMovieDetailResponse */
/** @typedef {import('./ophim.types').OphimTaxonomyResponse} OphimTaxonomyResponse */

const BASE_URL = 'https://vsmov.com/api';
const CDN_BASE = 'https://vsmov.com/storage/images/';

export function buildImageUrl(url) {
  if (typeof url !== 'string' || !url.trim()) return 'https://via.placeholder.com/300x450/131313/E50914?text=No+Image';
  if (url.startsWith('http')) return url;
  return CDN_BASE + url;
}

/**
 * @template T
 * @param {string} path
 * @param {Record<string, string | number | boolean | null | undefined>} [params]
 * @returns {Promise<T>}
 */
async function fetcher(path, params = {}) {
  const url = new URL(BASE_URL + path);
  Object.entries(params).forEach(([k, v]) => v != null && url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const payload = await res.json();
  if (payload.status === false || payload.status === 'error') {
    throw new Error(payload.msg || payload.message || 'VSMOV API error');
  }

  // Preserve the response contract consumed by existing pages.
  if (payload.movie) {
    return { ...payload, data: { item: { ...payload.movie, episodes: payload.episodes || [] } } };
  }
  if (Array.isArray(payload.items)) {
    const pagination = payload.pagination;
    return {
      ...payload,
      data: {
        items: payload.items,
        params: pagination ? {
          pagination: {
            ...pagination,
            totalItems: Number(pagination.totalItems),
            totalItemsPerPage: Number(pagination.totalItemsPerPage),
            currentPage: Number(pagination.currentPage),
          },
        } : {},
      },
    };
  }
  return payload;
}

/** @returns {Promise<OphimHomeResponse>} */
export const getHome = () => fetcher('/danh-sach/phim-moi-cap-nhat', { page: 1 });

/** Danh sách phim theo slug type */
export const getMovieList = (slug, page = 1, limit = 24) => {
  // VSMOV exposes these groups as genres rather than list endpoints.
  if (slug === 'hoat-hinh' || slug === 'tv-shows') {
    return fetcher(`/the-loai/${slug === 'tv-shows' ? 'truyen-hinh-thuc-te' : 'hoat-hinh'}`, { page, limit });
  }
  return fetcher(`/danh-sach/${slug === 'phim-moi' ? 'phim-moi-cap-nhat' : encodeURIComponent(slug)}`, { page, limit });
};

/**
 * Tìm kiếm phim.
 * @param {string} keyword
 * @param {number} [page=1]
 * @param {number} [limit=24]
 * @returns {Promise<OphimHomeResponse>}
 */
export const searchMovies = (keyword, page = 1, limit = 24) =>
  fetcher('/tim-kiem', { keyword, page, limit });

/**
 * Chi tiết phim theo slug.
 * @param {string} slug
 * @returns {Promise<OphimMovieDetailResponse>}
 */
export const getMovieDetail = (slug) => fetcher(`/phim/${slug}`);

/** @returns {Promise<OphimTaxonomyResponse>} */
export const getGenres = () => fetcher('/the-loai');

/** Phim theo thể loại */
export const getMoviesByGenre = (slug, page = 1, limit = 24) =>
  fetcher(`/the-loai/${slug}`, { page, limit });

/** @returns {Promise<OphimTaxonomyResponse>} */
export const getCountries = () => fetcher('/quoc-gia');

/** Phim theo quốc gia */
export const getMoviesByCountry = (slug, page = 1, limit = 24) =>
  fetcher(`/quoc-gia/${slug}`, { page, limit });

/**
 * Danh sách năm phát hành.
 * API này được giả định cùng shape taxonomy với data.items.
 * @returns {Promise<OphimTaxonomyResponse>}
 */
export const getYears = () => fetcher('/nam');

/** Phim theo năm phát hành */
export const getMoviesByYear = (year, page = 1, limit = 24) =>
  fetcher(`/nam/${year}`, { page, limit });

export const MOVIE_TYPE_SLUGS = [
  { slug: 'phim-moi', label: 'Phim Mới' },
  { slug: 'phim-bo', label: 'Phim Bộ' },
  { slug: 'phim-le', label: 'Phim Lẻ' },
  { slug: 'tv-shows', label: 'TV Shows' },
  { slug: 'hoat-hinh', label: 'Hoạt Hình' },
];
