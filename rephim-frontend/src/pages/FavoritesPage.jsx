import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trash2, HeartCrack, Heart } from "lucide-react";
import MovieCard from "../components/MovieCard";
import { getFavorites, toggleFavorite } from "../utils/storage";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState(() => getFavorites());

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleRemove = (movie) => {
    toggleFavorite(movie);
    setFavorites(getFavorites());
  };

  return (
    <div className="min-h-screen pt-20 pb-10 fade-in">
      <div className="container mx-auto px-4">
        <div className="glass rounded-2xl p-6 md:p-8 mb-8 text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-[#E50914]">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <Heart fill="#E50914" className="text-[#E50914]" size={36} /> Phim
              Yêu Thích
            </h1>
            <p className="text-gray-400 mt-1">
              Danh sách những bộ phim bạn đã lưu lại để xem sau.
            </p>
          </div>
          {favorites.length > 0 && (
            <div className="text-sm font-semibold glass px-4 py-2 rounded-full inline-flex mx-auto md:mx-0">
              Đã lưu:{" "}
              <span className="text-[#E50914] ml-1">{favorites.length}</span>{" "}
              phim
            </div>
          )}
        </div>

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 glass rounded-3xl mt-4">
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(229,9,20,0.15)]">
              <HeartCrack size={40} className="text-gray-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Chưa có phim nào
            </h2>
            <p className="text-gray-400 max-w-md text-center text-sm mb-8 leading-relaxed">
              Bộ sưu tập của bạn đang trống. Hãy khám phá hàng ngàn bộ phim hấp
              dẫn trên RePhim và thêm chúng vào danh sách này nhé!
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#E50914] text-white rounded-full font-bold hover:bg-red-700 transition-all hover:scale-105 shadow-xl shadow-red-900/30"
            >
              Khám phá phim ngay
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 fade-in">
            {favorites.map((movie) => (
              <div key={movie.slug} className="relative group">
                <MovieCard movie={movie} />
                <button
                  onClick={() => handleRemove(movie)}
                  className="absolute -top-2 -right-2 p-2 bg-[#E50914] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 hover:scale-110 shadow-lg shadow-black/80 translate-y-2 group-hover:translate-y-0"
                  title="Xoá khỏi yêu thích"
                >
                  <Trash2 size={16} fill="white" className="text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
