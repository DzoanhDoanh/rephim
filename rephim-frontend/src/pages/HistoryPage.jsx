import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, History, Play, Clock, Film } from "lucide-react";
import { getHistory, removeHistory, clearHistory } from "../utils/storage";
import { buildImageUrl } from "../api/ophim";

export default function HistoryPage() {
  const [history, setHistory] = useState(() => getHistory());
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleRemove = (slug) => {
    removeHistory(slug);
    setHistory(getHistory());
  };

  const handleClearAll = () => {
    if (
      window.confirm("Bạn có chắc muốn dọn sạch toàn bộ lịch sử xem không?")
    ) {
      clearHistory();
      setHistory([]);
    }
  };

  const handleResume = (item) => {
    navigate(`/xem/${item.movie.slug}/${item.episode.slug}`);
  };

  return (
    <div className="min-h-screen pt-20 pb-10 fade-in">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="glass rounded-2xl p-6 md:p-8 mb-8 text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-emerald-500 shadow-lg shadow-emerald-500/5">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center justify-center md:justify-start gap-3">
              <History className="text-emerald-500" size={32} /> Lịch Sử Xem
            </h1>
            <p className="text-gray-400 mt-2 text-sm">
              Các bộ phim bạn đã theo dõi. Dọn dẹp để bảo vệ quyền riêng tư.
            </p>
          </div>
          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className="bg-red-500/10 hover:bg-[#E50914] text-red-500 hover:text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2 group mx-auto md:mx-0 shadow-lg"
            >
              <Trash2 size={16} className="group-hover:animate-bounce" /> Xoá
              tất cả lịch sử
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 glass rounded-3xl mt-4 text-center">
            <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(16,185,129,0.15)]">
              <Film size={40} className="text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Chưa có lịch sử
            </h2>
            <p className="text-gray-400 max-w-sm mb-8 text-sm leading-relaxed">
              Bạn chưa xem tập phim nào. Khi bạn bắt đầu theo dõi phim, danh
              sách tiếp tục xem sẽ xuất hiện ở đây.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#E50914] text-white rounded-full font-bold hover:bg-red-700 transition-all hover:scale-105 shadow-xl shadow-red-900/30"
            >
              Quay lại trang chủ
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 fade-in">
            {history.map((item) => {
              const progress = item.duration
                ? Math.min(100, Math.max(0, (item.time / item.duration) * 100))
                : 0;
              const thumb = buildImageUrl(
                item.movie.thumb_url || item.movie.poster_url,
              );

              return (
                <div
                  key={item.movie.slug}
                  className="flex flex-col sm:flex-row gap-4 glass bg-linear-to-r hover:from-white/10 hover:to-transparent rounded-2xl p-4 relative group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 border border-white/5"
                >
                  {/* Thumbnail with Resume Action */}
                  <div
                    className="w-full sm:w-60 aspect-video rounded-xl overflow-hidden relative cursor-pointer shrink-0 shadow-lg shadow-black/50"
                    onClick={() => handleResume(item)}
                  >
                    <img
                      src={thumb}
                      alt={item.movie.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors">
                      <div className="w-14 h-14 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-[#E50914] transition-all duration-300 scale-50 group-hover:scale-100 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                        <Play fill="white" size={24} className="ml-1" />
                      </div>
                    </div>

                    {/* Progress Bar styled directly on thumbnail bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/80 backdrop-blur-sm">
                      <div
                        className="h-full bg-[#E50914] shadow-[0_0_10px_rgba(229,9,20,0.5)]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Information */}
                  <div className="flex-1 flex flex-col justify-center min-w-0 pr-10">
                    <Link
                      to={`/phim/${item.movie.slug}`}
                      className="text-xl md:text-2xl font-bold text-white hover:text-[#E50914] truncate mb-2 transition-colors"
                    >
                      {item.movie.name}
                    </Link>
                    <div className="flex items-center gap-3 text-sm text-gray-300 mb-3 font-semibold dark:text-gray-400">
                      <span className="glass px-2 py-0.5 rounded text-white font-bold tracking-wide">
                        Tập {item.episode.name}
                      </span>
                      {item.movie.year && (
                        <span className="flex items-center gap-1 opacity-80">
                          <Clock size={14} /> {item.movie.year}
                        </span>
                      )}
                    </div>

                    <div className="mt-auto flex items-center gap-2 text-xs text-gray-500 font-medium tracking-wide">
                      <span>Hoạt động cuối:</span>
                      <span className="text-gray-400">
                        {new Date(item.updatedAt).toLocaleString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Action: Delete Single Item */}
                  <button
                    onClick={() => handleRemove(item.movie.slug)}
                    className="absolute top-4 right-4 sm:top-1/2 sm:-translate-y-1/2 p-2.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all duration-200 z-10"
                    title={`Xoá "${item.movie.name}"`}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
