import { useMemo, useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { Filter, ChevronDown } from "lucide-react";
import {
  getMovieList,
  getMoviesByGenre,
  getMoviesByCountry,
  getMoviesByYear,
  getGenres,
  getCountries,
  getYears,
  MOVIE_TYPE_SLUGS,
} from "../api/ophim";
import MovieCard from "../components/MovieCard";
import Pagination from "../components/Pagination";
import { MovieGridSkeleton } from "../components/Loading";

function CategoriesPageInner({ type, genreSlug, countrySlug, year }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [genres, setGenres] = useState([]);
  const [countries, setCountries] = useState([]);
  const [years, setYears] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);

  const getYearValue = (y) => {
    if (y == null) return "";
    if (typeof y === "string" || typeof y === "number") return String(y);
    if (typeof y === "object") {
      if (y.slug != null) return String(y.slug);
      if (y.year != null) return String(y.year);
      if (y.name != null) return String(y.name);
    }
    return "";
  };

  const getYearLabel = (y) => {
    if (y == null) return "";
    if (typeof y === "string" || typeof y === "number") return String(y);
    if (typeof y === "object") {
      if (y.name != null) return String(y.name);
      if (y.year != null) return String(y.year);
      if (y.slug != null) return String(y.slug);
    }
    return "";
  };

  const pageTitle = useMemo(() => {
    if (type) {
      return MOVIE_TYPE_SLUGS.find((t) => t.slug === type)?.label || type;
    }
    if (genreSlug) {
      const genre = genres.find((g) => g.slug === genreSlug);
      return `Thể loại: ${genre?.name || genreSlug}`;
    }
    if (countrySlug) {
      const country = countries.find((c) => c.slug === countrySlug);
      return `Quốc gia: ${country?.name || countrySlug}`;
    }
    if (year) return `Năm: ${year}`;
    return "Phim Mới";
  }, [type, genreSlug, countrySlug, year, genres, countries]);

  // Load filter options
  useEffect(() => {
    getGenres()
      .then((d) => setGenres(d.data?.items || []))
      .catch(() => {});
    getCountries()
      .then((d) => setCountries(d.data?.items || []))
      .catch(() => {});
    getYears()
      .then((d) => setYears(Array.isArray(d.data?.items) ? d.data.items : []))
      .catch(() => {});
  }, []);

  // Load movies when route/page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    let fetcher;
    if (type) {
      fetcher = getMovieList(type, page);
    } else if (genreSlug) {
      fetcher = getMoviesByGenre(genreSlug, page);
    } else if (countrySlug) {
      fetcher = getMoviesByCountry(countrySlug, page);
    } else if (year) {
      fetcher = getMoviesByYear(year, page);
    } else {
      fetcher = getMovieList("phim-moi", page);
    }

    fetcher
      .then((d) => {
        const data = d.data || {};
        setMovies(data.items || []);
        const pp = data.params?.pagination;
        if (pp) {
          setTotalItems(pp.totalItems || 0);
          setTotalPages(
            Math.ceil((pp.totalItems || 0) / (pp.totalItemsPerPage || 24)),
          );
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [type, genreSlug, countrySlug, year, page]);

  const handlePageChange = (nextPage) => {
    setLoading(true);
    setMovies([]);
    setPage(nextPage);
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-white mb-1">
              <span className="text-[#E50914]">|</span> {pageTitle}
            </h1>
            {totalItems > 0 && (
              <p className="text-sm text-gray-500">
                {totalItems.toLocaleString()} bộ phim
              </p>
            )}
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 glass hover:bg-white/10 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
          >
            <Filter size={16} /> Bộ lọc{" "}
            <ChevronDown
              size={14}
              className={`transition-transform ${filterOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* Filter Panel */}
        {filterOpen && (
          <div className="glass rounded-2xl p-6 mb-8 fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Type */}
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-3 font-semibold">
                  Loại phim
                </p>
                <div className="flex flex-wrap gap-2">
                  {MOVIE_TYPE_SLUGS.map((t) => (
                    <Link
                      key={t.slug}
                      to={`/danh-sach/${t.slug}`}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${type === t.slug ? "bg-[#E50914] text-white" : "glass hover:bg-white/10 text-gray-300"}`}
                    >
                      {t.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Genre */}
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-3 font-semibold">
                  Thể loại
                </p>
                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                  {genres.slice(0, 16).map((g) => (
                    <Link
                      key={g.slug}
                      to={`/the-loai/${g.slug}`}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${genreSlug === g.slug ? "bg-[#E50914] text-white" : "glass hover:bg-white/10 text-gray-300"}`}
                    >
                      {g.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Year */}
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-3 font-semibold">
                  Năm phát hành
                </p>
                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                  {years.slice(0, 10).map((y) => {
                    const yearValue = getYearValue(y);
                    const yearLabel = getYearLabel(y);

                    if (!yearValue) return null;

                    return (
                      <Link
                        key={yearValue}
                        to={`/nam/${yearValue}`}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${year === yearValue ? "bg-[#E50914] text-white" : "glass hover:bg-white/10 text-gray-300"}`}
                      >
                        {yearLabel}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick filter tabs for types */}
        <div className="flex flex-wrap gap-2 mb-6">
          {MOVIE_TYPE_SLUGS.map((t) => (
            <Link
              key={t.slug}
              to={`/danh-sach/${t.slug}`}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${type === t.slug ? "bg-[#E50914] text-white shadow-lg shadow-red-900/30" : "glass glass-hover text-gray-300"}`}
            >
              {t.label}
            </Link>
          ))}
        </div>

        {/* Movie Grid */}
        {loading ? (
          <MovieGridSkeleton count={24} />
        ) : movies.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🎬</p>
            <p className="text-xl font-semibold text-gray-400">
              Không tìm thấy phim nào
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 fade-in">
            {movies.map((m) => (
              <MovieCard key={m._id || m.slug} movie={m} />
            ))}
          </div>
        )}

        {/* Pagination */}
        <Pagination
          current={page}
          total={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  const location = useLocation();
  const { type, genreSlug, countrySlug, year } = useParams();
  const routeKey = `${location.pathname}`;

  return (
    <CategoriesPageInner
      key={routeKey}
      type={type}
      genreSlug={genreSlug}
      countrySlug={countrySlug}
      year={year}
    />
  );
}
