import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Globe } from "lucide-react";

export default function LoginPage() {
  const [tab, setTab] = useState("login");
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Chức năng đăng nhập đang được phát triển!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background collage */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-linear-to-br from-[#0e0e0e] via-[#130a0a] to-[#0a0a0e]" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #E50914 0%, transparent 50%), radial-gradient(circle at 80% 20%, #7c3aed 0%, transparent 50%)",
          }}
        ></div>
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        ></div>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-block text-3xl font-black tracking-tighter text-white"
          >
            Re<span className="text-[#E50914]">Phim</span>
          </Link>
          <p className="text-gray-500 text-sm mt-1">Xem phim không giới hạn</p>
        </div>

        <div className="glass rounded-3xl p-8 shadow-2xl shadow-black/50">
          {/* Tabs */}
          <div className="flex bg-[#1c1b1b] rounded-2xl p-1 mb-8">
            {["login", "register"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${tab === t ? "bg-[#E50914] text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
              >
                {t === "login" ? "Đăng nhập" : "Đăng ký"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === "register" && (
              <div className="relative">
                <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1.5 block">
                  Tên hiển thị
                </label>
                <div className="flex items-center bg-[#1c1b1b] rounded-xl px-4 py-3 gap-3 border border-white/5 focus-within:border-[#E50914]/50 transition-colors">
                  <span className="text-gray-500 text-sm">👤</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nhập tên của bạn"
                    className="flex-1 bg-transparent outline-none text-white text-sm placeholder-gray-600"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1.5 block">
                Email
              </label>
              <div className="flex items-center bg-[#1c1b1b] rounded-xl px-4 py-3 gap-3 border border-white/5 focus-within:border-[#E50914]/50 transition-colors">
                <Mail size={16} className="text-gray-500 shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  required
                  className="flex-1 bg-transparent outline-none text-white text-sm placeholder-gray-600"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1.5 block">
                Mật khẩu
              </label>
              <div className="flex items-center bg-[#1c1b1b] rounded-xl px-4 py-3 gap-3 border border-white/5 focus-within:border-[#E50914]/50 transition-colors">
                <Lock size={16} className="text-gray-500 shrink-0" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="flex-1 bg-transparent outline-none text-white text-sm placeholder-gray-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {tab === "login" && (
              <div className="text-right">
                <a href="#" className="text-xs text-[#E50914] hover:underline">
                  Quên mật khẩu?
                </a>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#E50914] hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-red-900/50 hover:scale-[1.01] mt-2"
            >
              {tab === "login" ? "Đăng nhập" : "Tạo tài khoản"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-5">
            <span className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-500 font-medium">Hoặc</span>
            <span className="flex-1 h-px bg-white/10" />
          </div>

          {/* Social auth */}
          <button className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-3 rounded-xl transition-all duration-200">
            <Globe size={18} className="text-blue-400" />
            Đăng nhập với Google
          </button>

          <p className="text-center text-xs text-gray-600 mt-6">
            Bằng cách đăng nhập, bạn đồng ý với{" "}
            <a href="#" className="text-[#E50914] hover:underline">
              Điều khoản dịch vụ
            </a>{" "}
            của RePhim.
          </p>
        </div>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-sm text-gray-500 hover:text-white transition-colors"
          >
            ← Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
