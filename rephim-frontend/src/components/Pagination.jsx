import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ current, total, onPageChange }) {
  if (!total || total <= 1) return null;

  const pages = [];
  const delta = 2;
  const left = Math.max(1, current - delta);
  const right = Math.min(total, current + delta);

  if (left > 1) { pages.push(1); if (left > 2) pages.push('...'); }
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total) { if (right < total - 1) pages.push('...'); pages.push(total); }

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => onPageChange(current - 1)}
        disabled={current === 1}
        className="flex items-center gap-1 px-3 py-2 rounded-lg glass hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-medium">
        <ChevronLeft size={16} /> Trước
      </button>

      <div className="flex items-center gap-1">
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`dots-${i}`} className="px-3 py-2 text-gray-500 text-sm">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${
                p === current
                  ? 'bg-[#E50914] text-white shadow-lg shadow-red-900/50'
                  : 'glass hover:bg-white/10 text-gray-300'
              }`}>
              {p}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onPageChange(current + 1)}
        disabled={current === total}
        className="flex items-center gap-1 px-3 py-2 rounded-lg glass hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-medium">
        Tiếp <ChevronRight size={16} />
      </button>
    </div>
  );
}
