import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Play,
  Info,
  ChevronLeft,
  ChevronRight,
  Star,
  Zap,
  Monitor,
  Clock,
  History,
} from "lucide-react";
import {
  getHome,
  getMovieList,
  buildImageUrl,
  MOVIE_TYPE_SLUGS,
} from "../api/ophim";
import { getHistory } from "../utils/storage";
import MovieCard from "../components/MovieCard";
import { MovieGridSkeleton } from "../components/Loading";

// Hero Slider (Movies for banner)
function HeroSlider({ movies, loading }) {
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);

  const go = (next) => {
    setFading(true);
    setTimeout(() => {
      setIdx(next);
      setFading(false);
    }, 250);
  };

  useEffect(() => {
    if (!movies?.length) return;
    const timer = setInterval(() => go((idx + 1) % movies.length), 6000);
    return () => clearInterval(timer);
  }, [idx, movies]);

  if (loading || !movies?.length)
    return (
      <div className="relative h-[70vh] md:h-[85vh] bg-[#0e0e0e] flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-2 border-t-[#E50914] animate-spin" />
      </div>
    );

  const movie = movies[idx];
  const poster = buildImageUrl(movie.poster_url || movie.thumb_url);

  return (
    <div className="relative h-[70vh] md:h-[88vh] overflow-hidden">
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${fading ? "opacity-0" : "opacity-100"}`}
      >
        <img
          src={poster}
          alt={movie.name}
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-[#0e0e0e] via-transparent to-black/30" />
      </div>

      <div
        className={`relative z-10 h-full flex items-center transition-all duration-500 ${fading ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}
      >
        <div className="container mx-auto px-4 pt-16">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-2 text-white drop-shadow-2xl">
              {movie.name}
            </h1>
            <p className="text-lg text-gray-400 mb-6 font-medium line-clamp-1">
              {movie.origin_name}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to={`/phim/${movie.slug}`}
                className="flex items-center gap-2 bg-[#E50914] hover:bg-red-700 text-white font-bold px-6 py-3 rounded-full transition-all duration-200"
              >
                <Play size={18} fill="white" /> Xem ngay
              </Link>
              <Link
                to={`/phim/${movie.slug}`}
                className="flex items-center gap-2 glass hover:bg-white/15 text-white font-semibold px-6 py-3 rounded-full transition-all duration-200"
              >
                <Info size={18} /> Chi tiết
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MovieSection({ title, movies, href, loading }) {
  return (
    <section className="mb-14">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-white border-l-4 border-[#E50914] pl-3">
          {title}
        </h2>
        {href && (
          <Link
            to={href}
            className="text-sm text-[#E50914] hover:text-red-400 transition-colors"
          >
            Xem tất cả →
          </Link>
        )}
      </div>
      {loading ? (
        <MovieGridSkeleton count={6} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {movies?.map((m) => (
            <MovieCard key={m._id} movie={m} />
          ))}
        </div>
      )}
    </section>
  );
}

export default function HomePage() {
  const [history, setHistory] = useState([]);
  const [sections, setSections] = useState({
    "phim-moi": { title: "Phim Mới Cập Nhật", items: [], loading: true },
    "phim-bo": { title: "Phim Bộ Nổi Bật", items: [], loading: true },
    "phim-le": { title: "Phim Lẻ Đặc Sắc", items: [], loading: true },
  });

  useEffect(() => {
    setHistory(getHistory().slice(0, 6)); // Lấy 6 phim gần nhất

    // Fetch multiple lists to create sections
    getHome()
      .then((d) => {
        setSections((prev) => ({
          ...prev,
          "phim-moi": {
            ...prev["phim-moi"],
            items: d.data?.items?.slice(0, 12) || [],
            loading: false,
          },
        }));
      })
      .catch(() => {});

    getMovieList("phim-bo", 1, 6)
      .then((d) => {
        setSections((prev) => ({
          ...prev,
          "phim-bo": {
            ...prev["phim-bo"],
            items: d.data?.items || [],
            loading: false,
          },
        }));
      })
      .catch(() => {});

    getMovieList("phim-le", 1, 6)
      .then((d) => {
        setSections((prev) => ({
          ...prev,
          "phim-le": {
            ...prev["phim-le"],
            items: d.data?.items || [],
            loading: false,
          },
        }));
      })
      .catch(() => {});
  }, []);

  const heroMovies = sections["phim-moi"].items.slice(0, 5);

  return (
    <div className="min-h-screen">
      <HeroSlider movies={heroMovies} loading={sections["phim-moi"].loading} />

      <div className="container mx-auto px-4 mt-8">
        {history.length > 0 && (
          <section className="mb-14">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-white border-l-4 border-[#E50914] pl-3 flex items-center gap-2">
                <History size={20} /> Tiếp tục xem
              </h2>
              <Link
                to="/lich-su"
                className="text-sm text-[#E50914] hover:text-red-400 transition-colors"
              >
                Xem tất cả →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {history.map((item) => {
                const progress = item.duration
                  ? Math.min(
                      100,
                      Math.max(0, (item.time / item.duration) * 100),
                    )
                  : 0;
                const thumb = buildImageUrl(
                  item.movie.thumb_url || item.movie.poster_url,
                );
                return (
                  <Link
                    key={item.movie.slug}
                    to={`/xem/${item.movie.slug}/${item.episode.slug}`}
                    className="relative group block"
                  >
                    <div className="aspect-video bg-black/50 rounded-lg overflow-hidden relative">
                      <img
                        src={thumb}
                        alt={item.movie.name}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center group-hover:bg-[#E50914] transition-colors shadow-lg">
                          <Play fill="white" size={16} className="ml-1" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/60">
                        <div
                          className="h-full bg-[#E50914]"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-300 group-hover:text-white truncate font-medium">
                      {item.movie.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Tập {item.episode.name}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <MovieSection
          title={sections["phim-moi"].title}
          movies={sections["phim-moi"].items}
          loading={sections["phim-moi"].loading}
          href="/danh-sach/phim-moi"
        />
        <MovieSection
          title={sections["phim-bo"].title}
          movies={sections["phim-bo"].items}
          loading={sections["phim-bo"].loading}
          href="/danh-sach/phim-bo"
        />
        <MovieSection
          title={sections["phim-le"].title}
          movies={sections["phim-le"].items}
          loading={sections["phim-le"].loading}
          href="/danh-sach/phim-le"
        />
      </div>
    </div>
  );
}
