import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Play,
  Plus,
  Check,
  Star,
  Clock,
  Globe,
  Tag,
  Users,
  Film,
  ChevronRight,
} from "lucide-react";
import { getMovieDetail, buildImageUrl } from "../api/ophim";
import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "../components/Loading";
import {
  toggleFavorite,
  isFavorite as checkIsFavorite,
} from "../utils/storage";

export default function MovieDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [movieData, setMovieData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeServer, setActiveServer] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
    getMovieDetail(slug)
      .then((d) => {
        setMovieData(d);
        setIsFav(checkIsFavorite(slug));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading)
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );

  if (error || !movieData)
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center gap-4">
        <p className="text-6xl">🎬</p>
        <p className="text-xl text-gray-400">Không tìm thấy phim</p>
        <Link
          to="/"
          className="bg-[#E50914] text-white px-6 py-2 rounded-full hover:bg-red-700 transition"
        >
          Về trang chủ
        </Link>
      </div>
    );

  const movie = movieData.data?.item || movieData.movie || {};
  const episodes =
    movie.episodes || movieData.data?.episodes || movieData.episodes || [];
  const relatedMovies = movieData.data?.APP_DOMAIN_FRONTEND ? [] : [];

  const poster = buildImageUrl(movie.poster_url || movie.thumb_url);
  const thumb = buildImageUrl(movie.thumb_url || movie.poster_url);
  const description = (movie.content || "").replace(/<[^>]*>/g, "");

  const firstEpisode = episodes[activeServer]?.server_data?.[0];

  const handleWatch = () => {
    if (firstEpisode) {
      navigate(
        `/xem/${movie.slug}/${firstEpisode.slug || "tap-1"}?server=${activeServer}`,
      );
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero backdrop */}
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <img
          src={poster}
          alt={movie.name}
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#0e0e0e] via-[#0e0e0e]/60 to-black/40" />
        <div className="absolute inset-0 bg-linear-to-r from-[#0e0e0e]/80 to-transparent" />
      </div>

      {/* Content — overlaps hero */}
      <div className="container mx-auto px-4">
        <div className="relative -mt-48 md:-mt-64 z-10 flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="shrink-0 mx-auto md:mx-0">
            <div className="w-48 md:w-56 rounded-2xl overflow-hidden shadow-2xl shadow-black/80 ring-1 ring-white/10">
              <img
                src={thumb}
                alt={movie.name}
                className="w-full aspect-2/3 object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 fade-in">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              {movie.quality && (
                <span className="px-2.5 py-1 text-xs font-bold bg-[#E50914] text-white rounded-full">
                  {movie.quality}
                </span>
              )}
              {movie.lang && (
                <span className="px-2.5 py-1 text-xs font-semibold glass text-gray-300 rounded-full">
                  {movie.lang}
                </span>
              )}
              {movie.status && (
                <span className="px-2.5 py-1 text-xs font-semibold glass text-gray-300 rounded-full">
                  {movie.status}
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-white mb-1 leading-tight">
              {movie.name}
            </h1>
            {movie.origin_name && (
              <p className="text-lg text-gray-400 mb-4">{movie.origin_name}</p>
            )}

            {/* Meta grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              {[
                {
                  icon: <Star size={14} className="text-yellow-400" />,
                  label: "Năm",
                  value: movie.year,
                },
                {
                  icon: <Clock size={14} className="text-blue-400" />,
                  label: "Thời lượng",
                  value: movie.time,
                },
                {
                  icon: <Globe size={14} className="text-green-400" />,
                  label: "Quốc gia",
                  value: movie.country?.map((c) => c.name).join(", "),
                },
                {
                  icon: <Film size={14} className="text-purple-400" />,
                  label: "Tập",
                  value: movie.episode_current,
                },
              ]
                .filter((i) => i.value)
                .map((item, i) => (
                  <div key={i} className="glass rounded-xl px-3 py-2">
                    <div className="flex items-center gap-1.5 mb-1">
                      {item.icon}
                      <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                        {item.label}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-white truncate">
                      {item.value}
                    </p>
                  </div>
                ))}
            </div>

            {/* Genre tags */}
            {movie.category?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {movie.category.map((c) => (
                  <Link
                    key={c.slug}
                    to={`/the-loai/${c.slug}`}
                    className="flex items-center gap-1 px-3 py-1.5 glass glass-hover rounded-full text-xs text-gray-300 hover:text-[#E50914] transition-colors"
                  >
                    <Tag size={10} /> {c.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Director & Actor */}
            {movie.director?.length > 0 &&
              movie.director[0] !== "Đang cập nhật" && (
                <p className="text-sm text-gray-400 mb-1">
                  <span className="text-gray-500">Đạo diễn: </span>
                  <span className="text-white font-medium">
                    {movie.director.join(", ")}
                  </span>
                </p>
              )}
            {movie.actor?.length > 0 && movie.actor[0] !== "Đang cập nhật" && (
              <div className="flex items-start gap-2 mb-5">
                <Users size={14} className="text-gray-500 mt-0.5 shrink-0" />
                <p className="text-sm text-gray-400">
                  <span className="text-gray-500">Diễn viên: </span>
                  <span className="text-white font-medium">
                    {movie.actor.slice(0, 8).join(", ")}
                    {movie.actor.length > 8 ? "..." : ""}
                  </span>
                </p>
              </div>
            )}

            {/* Description */}
            {description && (
              <div className="mb-6">
                <p
                  className={`text-sm text-gray-400 leading-relaxed ${expanded ? "" : "line-clamp-3"}`}
                >
                  {description}
                </p>
                {description.length > 200 && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-xs text-[#E50914] mt-1 hover:underline"
                  >
                    {expanded ? "Thu gọn" : "Xem thêm"}
                  </button>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleWatch}
                className="flex items-center gap-2 bg-[#E50914] hover:bg-red-700 text-white font-bold px-6 py-3 rounded-full transition-all shadow-lg shadow-red-900/30"
              >
                <Play size={18} fill="white" /> Xem Ngay
              </button>
              <button
                onClick={() => setIsFav(toggleFavorite(movie))}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-full transition-all border border-white/10"
              >
                {isFav ? (
                  <Check size={18} className="text-green-400" />
                ) : (
                  <Plus size={18} />
                )}
                {isFav ? "Đã lưu" : "Yêu thích"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Episodes section */}
      {episodes.length > 0 && (
        <div className="container mx-auto px-4 mt-12">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-1 h-7 bg-[#E50914] rounded-full" />
            <h2 className="text-xl font-bold text-white">Danh sách tập</h2>
          </div>

          {/* Server tabs */}
          {episodes.length > 1 && (
            <div className="flex gap-2 mb-4">
              {episodes.map((server, i) => (
                <button
                  key={i}
                  onClick={() => setActiveServer(i)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${i === activeServer ? "bg-[#E50914] text-white" : "glass glass-hover text-gray-300"}`}
                >
                  {server.server_name}
                </button>
              ))}
            </div>
          )}

          {/* Episode grid */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2">
            {episodes[activeServer]?.server_data?.map((ep, i) => (
              <Link
                key={i}
                to={`/xem/${movie.slug}/${ep.slug || `tap-${i + 1}`}?server=${activeServer}`}
                className="glass glass-hover text-center py-2 px-1 rounded-lg text-xs font-semibold text-gray-300 hover:text-white hover:bg-[#E50914]/20 transition-all"
              >
                {ep.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Related movies placeholder */}
      <div className="container mx-auto px-4 mt-12 mb-8">
        <div className="flex items-center gap-3 mb-5">
          <span className="w-1 h-7 bg-[#E50914] rounded-full" />
          <h2 className="text-xl font-bold text-white">Có thể bạn thích</h2>
          <Link
            to={`/the-loai/${movie.category?.[0]?.slug || ""}`}
            className="ml-auto text-sm text-[#E50914] flex items-center gap-1"
          >
            Xem thêm <ChevronRight size={14} />
          </Link>
        </div>
        <p className="text-sm text-gray-500">
          Khám phá thêm phim cùng thể loại bên dưới
        </p>
      </div>
    </div>
  );
}
