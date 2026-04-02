import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { searchMovies } from '../api/ophim';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import { MovieGridSkeleton } from '../components/Loading';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [query, setQuery] = useState(q);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!q) return;
    setQuery(q);
    setLoading(true);
    setSearched(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    searchMovies(q, page)
      .then(d => {
        setMovies(d.data?.items || []);
        const pp = d.data?.params?.pagination;
        if (pp) {
          setTotalItems(pp.totalItems || 0);
          setTotalPages(Math.ceil((pp.totalItems || 0) / (pp.totalItemsPerPage || 24)));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [q, page]);

  useEffect(() => { setPage(1); }, [q]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchParams({ q: query.trim() });
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Search bar */}
        <div className="max-w-2xl mx-auto mb-10">
          <form onSubmit={handleSubmit} className="relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Tìm kiếm phim, diễn viên, thể loại..."
              className="w-full bg-[#1c1b1b] border border-white/10 focus:border-[#E50914]/50 rounded-2xl pl-12 pr-12 py-4 text-white placeholder-gray-600 outline-none text-base transition-colors"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')}
                className="absolute right-14 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                <X size={18} />
              </button>
            )}
            <button type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#E50914] hover:bg-red-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all">
              Tìm
            </button>
          </form>
        </div>

        {/* Results header */}
        {q && (
          <div className="flex items-center gap-3 mb-6">
            <span className="w-1 h-7 bg-[#E50914] rounded-full" />
            <h1 className="text-xl font-bold text-white">
              Kết quả cho: <span className="text-[#E50914]">"{q}"</span>
            </h1>
            {totalItems > 0 && <span className="text-gray-500 text-sm">({totalItems.toLocaleString()} phim)</span>}
          </div>
        )}

        {/* States */}
        {!q && !searched ? (
          <div className="text-center py-24">
            <Search size={64} className="mx-auto mb-4 text-gray-700" />
            <h2 className="text-2xl font-bold text-gray-500 mb-2">Tìm kiếm phim</h2>
            <p className="text-gray-600 text-sm">Nhập tên phim, diễn viên hoặc thể loại bạn muốn tìm</p>
          </div>
        ) : loading ? (
          <MovieGridSkeleton count={12} />
        ) : movies.length === 0 && q ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🔍</p>
            <h2 className="text-xl font-semibold text-gray-400">Không tìm thấy kết quả</h2>
            <p className="text-gray-600 text-sm mt-2">Thử từ khóa khác hoặc kiểm tra chính tả</p>
            <Link to="/" className="mt-6 inline-block bg-[#E50914] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-red-700 transition">
              Về trang chủ
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 fade-in">
              {movies.map(m => <MovieCard key={m._id || m.slug} movie={m} />)}
            </div>
            <Pagination current={page} total={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
