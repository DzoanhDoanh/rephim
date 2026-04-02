import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  Search,
  X,
  Menu,
  ChevronDown,
  User,
  Heart,
  History,
} from "lucide-react";
import {
  getGenres,
  searchMovies,
  buildImageUrl,
  MOVIE_TYPE_SLUGS,
} from "../api/ophim";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    getGenres()
      .then((d) => setGenres(d.data?.items || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([]);
      return;
    }
    clearTimeout(timeoutRef.current);
    setSearching(true);
    timeoutRef.current = setTimeout(async () => {
      try {
        const d = await searchMovies(search, 1, 6);
        setSearchResults(d.data?.items || []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);
  }, [search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/tim-kiem?q=${encodeURIComponent(search.trim())}`);
    setSearch("");
    setSearchResults([]);
    setSearchOpen(false);
  };

  const closeSearch = () => {
    setSearch("");
    setSearchResults([]);
    setSearchOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0e0e0e]/95 backdrop-blur-xl shadow-lg shadow-black/50"
          : "bg-linear-to-b from-black/80 to-transparent backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="shrink-0 flex items-center text-2xl font-black tracking-tighter text-white"
        >
          <img
            src="/rephim-no-background.png"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
            alt="RePhim"
            className="w-9 h-9 object-contain"
            loading="eager"
            decoding="async"
          />
          Re<span className="text-[#E50914]">Phim</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
          >
            Trang chủ
          </Link>

          {/* Danh sách dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/5">
              Danh sách{" "}
              <ChevronDown
                size={14}
                className="group-hover:rotate-180 transition-transform"
              />
            </button>
            <div className="absolute top-full left-0 mt-1 w-44 glass-strong rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl shadow-black/50">
              {MOVIE_TYPE_SLUGS.map((t) => (
                <Link
                  key={t.slug}
                  to={`/danh-sach/${t.slug}`}
                  className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-[#E50914]/20 transition-colors"
                >
                  {t.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Thể loại dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/5">
              Thể loại{" "}
              <ChevronDown
                size={14}
                className="group-hover:rotate-180 transition-transform"
              />
            </button>
            <div className="absolute top-full left-0 mt-1 w-56 glass-strong rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl shadow-black/50 max-h-72 overflow-y-auto">
              {genres.map((g) => (
                <Link
                  key={g.slug}
                  to={`/the-loai/${g.slug}`}
                  className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#E50914]/20 transition-colors"
                >
                  {g.name}
                </Link>
              ))}
            </div>
          </div>

          <Link
            to="/danh-sach/phim-moi"
            className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
          >
            Top phim
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Search bar */}
          <div className="relative">
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <div className="flex items-center glass-strong rounded-full pl-4 pr-2 py-1.5">
                  <input
                    ref={searchRef}
                    autoFocus
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Tìm kiếm phim..."
                    className="bg-transparent outline-none text-sm w-48 text-white placeholder-gray-500"
                  />
                  <button
                    type="button"
                    onClick={closeSearch}
                    className="ml-2 p-1 hover:text-[#E50914] transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
                {/* Search results dropdown */}
                {(searchResults.length > 0 || searching) && (
                  <div className="absolute top-full right-0 mt-2 w-80 glass-strong rounded-xl overflow-hidden shadow-xl shadow-black/50 z-50">
                    {searching && (
                      <div className="px-4 py-3 text-sm text-gray-400">
                        Đang tìm kiếm...
                      </div>
                    )}
                    {searchResults.map((m) => (
                      <Link
                        key={m._id}
                        to={`/phim/${m.slug}`}
                        onClick={closeSearch}
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/10 transition-colors"
                      >
                        <img
                          src={buildImageUrl(m.thumb_url)}
                          alt={m.name}
                          className="w-10 h-14 object-cover rounded shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white line-clamp-1">
                            {m.name}
                          </p>
                          <p className="text-xs text-gray-400 line-clamp-1">
                            {m.origin_name}
                          </p>
                          <p className="text-xs text-[#E50914]">
                            {m.year} • {m.episode_current}
                          </p>
                        </div>
                      </Link>
                    ))}
                    {searchResults.length > 0 && (
                      <button
                        onClick={() => {
                          navigate(`/tim-kiem?q=${encodeURIComponent(search)}`);
                          closeSearch();
                        }}
                        className="w-full px-4 py-2.5 text-sm text-[#E50914] hover:bg-white/5 transition-colors text-center font-medium border-t border-white/5"
                      >
                        Xem tất cả kết quả →
                      </button>
                    )}
                  </div>
                )}
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-300 hover:text-white"
              >
                <Search size={20} />
              </button>
            )}
          </div>

          {/* User Links */}
          <div className="hidden lg:flex items-center gap-2 mr-2 border-r border-white/10 pr-4">
            <Link
              to="/yeu-thich"
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-300 hover:text-[#E50914] relative group"
            >
              <Heart size={20} />
              <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/80 text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap hidden md:block">
                Phim yêu thích
              </span>
            </Link>
            <Link
              to="/lich-su"
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-300 hover:text-white relative group"
            >
              <History size={20} />
              <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/80 text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap hidden md:block">
                Lịch sử xem
              </span>
            </Link>
          </div>

          <Link
            to="/dang-nhap"
            className="hidden md:flex items-center gap-2 bg-[#E50914] hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-red-900/50"
          >
            <User size={16} /> Đăng nhập
          </Link>

          {/* Mobile menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div className="md:hidden bg-[#131313] border-t border-white/5 px-4 py-4 space-y-1">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 text-sm rounded-lg hover:bg-white/5"
          >
            Trang chủ
          </Link>
          <Link
            to="/yeu-thich"
            onClick={() => setMenuOpen(false)}
            className="px-3 py-2 flex items-center gap-2 text-sm rounded-lg hover:bg-white/5 text-gray-300"
          >
            <Heart size={16} /> Phim yêu thích
          </Link>
          <Link
            to="/lich-su"
            onClick={() => setMenuOpen(false)}
            className="px-3 py-2 flex items-center gap-2 text-sm rounded-lg hover:bg-white/5 text-gray-300 border-b border-white/5 pb-3 mb-2"
          >
            <History size={16} /> Lịch sử xem
          </Link>
          {MOVIE_TYPE_SLUGS.map((t) => (
            <Link
              key={t.slug}
              to={`/danh-sach/${t.slug}`}
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 text-sm rounded-lg hover:bg-white/5"
            >
              {t.label}
            </Link>
          ))}
          <Link
            to="/dang-nhap"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 text-sm text-[#E50914] font-semibold border-t border-white/5 mt-2 pt-3"
          >
            <User size={16} className="inline mr-1 -mt-0.5" />
            Đăng nhập
          </Link>
        </div>
      )}
    </header>
  );
}
