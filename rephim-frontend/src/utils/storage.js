// Quản lý LocalStorage cho Lịch sử xem và Yêu thích

const HISTORY_KEY = "rephim_history";
const FAVORITES_KEY = "rephim_favorites";

export const getHistory = () => {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveHistory = (movie, episode, time, duration) => {
  try {
    const history = getHistory();
    const existingIdx = history.findIndex((h) => h.movie.slug === movie.slug);
    const newItem = {
      movie: {
        _id: movie._id,
        name: movie.name,
        slug: movie.slug,
        origin_name: movie.origin_name,
        thumb_url: movie.thumb_url,
        poster_url: movie.poster_url,
        year: movie.year,
      },
      episode: {
        name: episode.name,
        slug: episode.slug,
        server_name: episode.server_name || "",
      },
      time,
      duration,
      updatedAt: new Date().toISOString(),
    };

    if (existingIdx !== -1) {
      history[existingIdx] = newItem;
    } else {
      history.unshift(newItem);
    }

    // Giữ tối đa 50 item
    const limitedHistory = history
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 50);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(limitedHistory));
  } catch (e) {
    console.error("Error saving history", e);
  }
};

export const removeHistory = (slug) => {
  try {
    const history = getHistory().filter((h) => h.movie.slug !== slug);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.error("Error removing history", e);
  }
};

export const clearHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
};

export const getFavorites = () => {
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const toggleFavorite = (movie) => {
  try {
    let favorites = getFavorites();
    const exists = favorites.some((f) => f.slug === movie.slug);

    if (exists) {
      favorites = favorites.filter((f) => f.slug !== movie.slug);
    } else {
      favorites.unshift({
        _id: movie._id,
        name: movie.name,
        slug: movie.slug,
        origin_name: movie.origin_name,
        thumb_url: movie.thumb_url,
        poster_url: movie.poster_url,
        year: movie.year,
        quality: movie.quality,
        lang: movie.lang,
        episode_current: movie.episode_current,
        addedAt: new Date().toISOString(),
      });
    }

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return !exists; // Trả về trạng thái hiện tại (true = đã thêm, false = đã xoá)
  } catch (e) {
    console.error("Error toggling favorite", e);
    return false;
  }
};

export const isFavorite = (slug) => {
  return getFavorites().some((f) => f.slug === slug);
};
