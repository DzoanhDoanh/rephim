import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import CategoriesPage from "./pages/CategoriesPage";
import MovieDetailPage from "./pages/MovieDetailPage";
import PlayerPage from "./pages/PlayerPage";
import LoginPage from "./pages/LoginPage";
import SearchPage from "./pages/SearchPage";
import FavoritesPage from "./pages/FavoritesPage";
import HistoryPage from "./pages/HistoryPage";

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Layout wrapper
function Layout({ children, noFooter = false }) {
  console.log("Layout rendering...");
  return (
    <div className="min-h-screen flex flex-col bg-[#0e0e0e] text-[#e5e2e1]">
      <Header />
      <main className="flex-1 pt-12">{children}</main>
      {!noFooter && <Footer />}
    </div>
  );
}

// Player layout (no header/footer)
function PlayerLayout() {
  console.log("Player layout rendering...");
  return (
    <div className="min-h-screen bg-black">
      <PlayerPage />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Home */}
        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />

        {/* Search */}
        <Route
          path="/tim-kiem"
          element={
            <Layout>
              <SearchPage />
            </Layout>
          }
        />

        {/* Classification lists */}
        <Route
          path="/danh-sach/:type"
          element={
            <Layout>
              <CategoriesPage />
            </Layout>
          }
        />
        <Route
          path="/the-loai/:genreSlug"
          element={
            <Layout>
              <CategoriesPage />
            </Layout>
          }
        />
        <Route
          path="/quoc-gia/:countrySlug"
          element={
            <Layout>
              <CategoriesPage />
            </Layout>
          }
        />
        <Route
          path="/nam/:year"
          element={
            <Layout>
              <CategoriesPage />
            </Layout>
          }
        />

        {/* User features */}
        <Route
          path="/yeu-thich"
          element={
            <Layout>
              <FavoritesPage />
            </Layout>
          }
        />
        <Route
          path="/lich-su"
          element={
            <Layout>
              <HistoryPage />
            </Layout>
          }
        />

        {/* Details */}
        <Route
          path="/phim/:slug"
          element={
            <Layout>
              <MovieDetailPage />
            </Layout>
          }
        />

        {/* Specialized */}
        <Route
          path="/dang-nhap"
          element={
            <Layout noFooter>
              <LoginPage />
            </Layout>
          }
        />
        <Route path="/xem/:slug/:tap" element={<PlayerLayout />} />

        {/* 404 */}
        <Route
          path="*"
          element={
            <Layout>
              <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center">
                <h1 className="text-9xl font-black text-[#E50914] selection:bg-white selection:text-red-600">
                  404
                </h1>
                <p className="text-2xl font-bold text-white mb-4">
                  Trang không tồn tại hoặc đã bị xóa
                </p>
                <a
                  href="/"
                  className="bg-[#E50914] text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition transform hover:scale-105"
                >
                  Về trang chủ
                </a>
              </div>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}
