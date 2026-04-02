import { Link } from "react-router-dom";
import { Globe, Share2, Play, Info, Mail } from "lucide-react";
import { MOVIE_TYPE_SLUGS } from "../api/ophim";

export default function Footer() {
  return (
    <footer className="mt-24 bg-[#0a0a0a] border-t border-white/5">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & desc */}
          <div className="md:col-span-1">
            <Link
              to="/"
              className="flex items-center text-2xl font-black tracking-tighter text-white"
            >
              <img
                src="/rephim-no-background.png"
                alt="RePhim"
                className="w-9 h-9 object-contain"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              Re<span className="text-[#E50914]">Phim</span>
            </Link>
            <p className="mt-3 text-sm text-gray-500 leading-relaxed">
              Nền tảng xem phim trực tuyến miễn phí, không quảng cáo. Thưởng
              thức hàng nghìn bộ phim chất lượng cao.
            </p>
            <div className="flex gap-3 mt-4">
              {[Globe, Share2, Play, Info].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-[#E50914]/80 text-gray-400 hover:text-white transition-all duration-200"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Danh sách phim */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Danh sách
            </h3>
            <ul className="space-y-2">
              {MOVIE_TYPE_SLUGS.map((t) => (
                <li key={t.slug}>
                  <Link
                    to={`/danh-sach/${t.slug}`}
                    className="text-sm text-gray-500 hover:text-[#E50914] transition-colors"
                  >
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hỗ trợ */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Hỗ trợ
            </h3>
            <ul className="space-y-2">
              {[
                "Điều khoản dịch vụ",
                "Chính sách riêng tư",
                "Liên hệ",
                "Báo lỗi",
                "Yêu cầu phim",
              ].map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="text-sm text-gray-500 hover:text-[#E50914] transition-colors"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Liên hệ */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Liên hệ
            </h3>
            <a
              href="mailto:support@rephim.cc"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#E50914] transition-colors"
            >
              <Mail size={14} />
              support@rephim.cc
            </a>
            <div className="mt-4 p-3 rounded-xl bg-[#E50914]/10 border border-[#E50914]/20">
              <p className="text-xs text-gray-400">
                Dữ liệu phim được cung cấp bởi
              </p>
              <a
                href="https://ophim17.cc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-[#E50914]"
              >
                OPhim API
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © 2026 RePhim. Tất cả các quyền được bảo lưu.
          </p>
          <p className="text-xs text-gray-600">
            Được xây dựng với ❤️ cho người yêu phim Việt Nam
          </p>
        </div>
      </div>
    </footer>
  );
}
