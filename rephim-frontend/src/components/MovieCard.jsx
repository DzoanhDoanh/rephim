import { Link } from "react-router-dom";
import { Play, Star } from "lucide-react";
import { buildImageUrl } from "../api/ophim";

export default function MovieCard({ movie }) {
  if (!movie) return null;
  const thumb = buildImageUrl(movie.thumb_url || movie.poster_url);

  return (
    <Link
      to={`/phim/${movie.slug}`}
      className="movie-card block group relative rounded-xl overflow-hidden bg-[#1c1b1b] cursor-pointer"
    >
      {/* Poster */}
      <div className="relative aspect-2/3 overflow-hidden">
        <img
          src={thumb}
          alt={movie.name}
          loading="lazy"
          onError={(e) => {
            e.target.src = `https://placehold.co/300x450/131313/E50914?text=${encodeURIComponent(movie.name || "No Image")}`;
          }}
          className="poster w-full h-full object-cover"
        />
        {/* Dark gradient bottom */}
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />

        {/* Top badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {movie.quality && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#E50914] text-white rounded">
              {movie.quality}
            </span>
          )}
          {movie.lang && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-black/60 text-white rounded backdrop-blur-sm">
              {movie.lang}
            </span>
          )}
        </div>

        {/* Episode badge */}
        {movie.episode_current && (
          <div className="absolute top-2 right-2">
            <span className="px-1.5 py-0.5 text-[10px] font-medium bg-black/60 text-gray-300 rounded backdrop-blur-sm">
              {movie.episode_current}
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="overlay absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-full bg-[#E50914] flex items-center justify-center pulse-red">
            <Play size={20} className="ml-0.5" fill="white" />
          </div>
          <span className="text-xs font-semibold bg-white/10 border border-white/20 text-white px-3 py-1.5 rounded-full backdrop-blur-sm">
            Xem chi tiết
          </span>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 px-2 pb-2">
          {movie.year && (
            <div className="flex items-center gap-1 mb-1">
              <Star size={10} className="text-yellow-400" fill="#facc15" />
              <span className="text-[10px] text-yellow-400 font-medium">
                {movie.year}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <div className="p-2.5">
        <h3 className="text-sm font-semibold text-white line-clamp-1 group-hover:text-[#E50914] transition-colors">
          {movie.name}
        </h3>
        {movie.origin_name && (
          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
            {movie.origin_name}
          </p>
        )}
      </div>
    </Link>
  );
}
