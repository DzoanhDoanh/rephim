import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  useParams,
  useNavigate,
  useSearchParams,
  Link,
} from "react-router-dom";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipForward,
  SkipBack,
  Settings,
  List,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Heart,
  RotateCcw,
  RotateCw,
  X,
} from "lucide-react";
import { getMovieDetail } from "../api/ophim";
import Hls from "hls.js";
import {
  saveHistory,
  toggleFavorite,
  isFavorite as checkIsFavorite,
} from "../utils/storage";

const NEXT_EPISODE_SHOW_REMAINING = 30;

function formatTime(secs) {
  if (isNaN(secs)) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function PlayerPage() {
  const { slug, tap } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const serverIdx = parseInt(searchParams.get("server") || "0");

  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const progressBarRef = useRef(null);

  const [movieData, setMovieData] = useState(null);
  const [activeServer, setActiveServer] = useState(serverIdx);
  const [episodes, setEpisodes] = useState([]);
  const [epListOpen, setEpListOpen] = useState(false);

  // Player state
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [buffering, setBuffering] = useState(false);
  const [videoError, setVideoError] = useState(null);
  const [isFav, setIsFav] = useState(false);
  const [nextEpisodeDismissedFor, setNextEpisodeDismissedFor] = useState(null);

  // Dragging states
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);

  // Load movie data
  useEffect(() => {
    let cancelled = false;

    getMovieDetail(slug)
      .then((d) => {
        if (cancelled) return;
        setMovieData(d);
        const item = d.data?.item || d.movie || {};
        setIsFav(checkIsFavorite(slug));
        const eps = item.episodes || d.data?.episodes || d.episodes || [];
        setEpisodes(eps);

        const serverIdxSafe = Math.min(
          serverIdx,
          Math.max(0, eps.length - 1),
        );
        setActiveServer(serverIdxSafe);
      })
      .catch((e) => {
        if (!cancelled) setVideoError(e.message);
      });

    return () => {
      cancelled = true;
    };
  }, [slug, serverIdx]);

  const serverEps = useMemo(
    () => episodes[activeServer]?.server_data || [],
    [episodes, activeServer],
  );
  const currentEp = useMemo(() => {
    if (!serverEps.length) return null;
    return (
      serverEps.find(
        (e) => e.slug === tap || e.slug === `tap-${tap}` || e.name === tap,
      ) || serverEps[0]
    );
  }, [serverEps, tap]);

  // HLS setup
  useEffect(() => {
    if (!currentEp?.link_m3u8 || !videoRef.current) return;
    const video = videoRef.current;

    queueMicrotask(() => {
      setVideoError(null);
      setBuffering(true);
      setPlaying(false);
    });

    const setupHLS = () => {
      try {
        if (hlsRef.current) {
          hlsRef.current.destroy();
        }

        if (Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90,
          });
          hlsRef.current = hls;
          hls.loadSource(currentEp.link_m3u8);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play().catch(() => {});
            setPlaying(true);
            setBuffering(false);
          });
          hls.on(Hls.Events.ERROR, (_, data) => {
            if (data.fatal) {
              console.error("HLS Fatal Error:", data);
              setVideoError(
                "Không thể phát video nguồn HLS. Đang thử chuyển sang trình phát dự phòng...",
              );
              setBuffering(false);
            }
          });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = currentEp.link_m3u8;
          video.play().catch(() => {});
          setPlaying(true);
          setBuffering(false);
        } else {
          setVideoError("Trình duyệt không hỗ trợ phát HLS.");
          setBuffering(false);
        }
      } catch (e) {
        console.error("HLS Setup Error:", e);
        setVideoError("Lỗi khởi tạo trình phát.");
        setBuffering(false);
      }
    };

    setupHLS();
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [currentEp]);

  // Video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let lastSaveTime = 0;
    const onTime = () => {
      setCurrentTime(video.currentTime);

      // Save history every 10 seconds
      if (
        Math.abs(video.currentTime - lastSaveTime) > 10 &&
        movieData &&
        currentEp &&
        video.duration
      ) {
        lastSaveTime = video.currentTime;
        const movie = movieData?.data?.item || movieData?.movie || {};
        saveHistory(movie, currentEp, video.currentTime, video.duration);
      }
    };

    const onDuration = () => setDuration(video.duration);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onWaiting = () => setBuffering(true);
    const onCanPlay = () => setBuffering(false);
    const onEnded = () => {
      setPlaying(false);
    };

    video.addEventListener("timeupdate", onTime);
    video.addEventListener("loadedmetadata", onDuration);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("ended", onEnded);
    return () => {
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("loadedmetadata", onDuration);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("ended", onEnded);
    };
  }, [movieData, currentEp]);

  // Controls auto-hide
  const showControls = useCallback(() => {
    setControlsVisible(true);
    clearTimeout(controlsTimeoutRef.current);
    if (playing && !epListOpen) {
      controlsTimeoutRef.current = setTimeout(
        () => setControlsVisible(false),
        3000,
      );
    }
  }, [playing, epListOpen]);

  // Prevent controls auto-hide when episode list is open
  useEffect(() => {
    if (epListOpen) {
      clearTimeout(controlsTimeoutRef.current);
      return;
    }

    if (!playing) return;

    const timeoutId = setTimeout(() => {
      showControls();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [epListOpen, playing, showControls]);

  // Sync fullscreen state with document fullscreen element changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFS = !!document.fullscreenElement;
      setFullscreen(isFS);
      if (!isFS) {
        if (screen.orientation && typeof screen.orientation.unlock === "function") {
          try {
            screen.orientation.unlock();
          } catch (e) {
            console.warn("Screen orientation unlock failed:", e);
          }
        }
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const skipSeconds = (secs) => {
    const video = videoRef.current;
    if (video)
      video.currentTime = Math.min(
        Math.max(0, video.currentTime + secs),
        duration,
      );
  };

  const currentEpIdx = serverEps.findIndex((e) => e.slug === currentEp?.slug);
  const nextEp = currentEpIdx >= 0 ? serverEps[currentEpIdx + 1] : null;
  const hasNextEp = Boolean(nextEp);
  const shouldShowNextEpisode =
    hasNextEp &&
    duration > NEXT_EPISODE_SHOW_REMAINING &&
    duration - currentTime <= NEXT_EPISODE_SHOW_REMAINING &&
    nextEpisodeDismissedFor !== currentEp?.slug;

  const goNextEp = () => {
    if (currentEpIdx < serverEps.length - 1) {
      const next = serverEps[currentEpIdx + 1];
      navigate(`/xem/${slug}/${next.slug}?server=${activeServer}`);
    }
  };
  const goPrevEp = () => {
    if (currentEpIdx > 0) {
      const prev = serverEps[currentEpIdx - 1];
      navigate(`/xem/${slug}/${prev.slug}?server=${activeServer}`);
    }
  };

  // Add auto next episode
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      if (currentEpIdx < serverEps.length - 1) {
        const next = serverEps[currentEpIdx + 1];
        navigate(`/xem/${slug}/${next.slug}?server=${activeServer}`);
      }
    };

    video.addEventListener("ended", handleEnded);
    return () => video.removeEventListener("ended", handleEnded);
  }, [currentEpIdx, serverEps, slug, activeServer, navigate]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    playing ? video.pause() : video.play();
  };

  const handleVideoContainerClick = () => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) {
      if (controlsVisible) {
        setControlsVisible(false);
        clearTimeout(controlsTimeoutRef.current);
      } else {
        showControls();
      }
    } else {
      togglePlay();
      showControls();
    }
  };

  const handleContainerTouchStart = (e) => {
    if (e.target.closest(".center-click-area")) {
      return;
    }
    showControls();
  };

  const getProgressFromEvent = useCallback((e) => {
    if (!progressBarRef.current || !duration) return 0;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clientX = e.touches && e.touches.length > 0
      ? e.touches[0].clientX
      : (e.changedTouches && e.changedTouches.length > 0
          ? e.changedTouches[0].clientX
          : e.clientX);
    const ratio = (clientX - rect.left) / rect.width;
    return Math.min(Math.max(0, ratio * 100), 100);
  }, [duration]);

  const handleSeekStart = (e) => {
    setIsDragging(true);
    const p = getProgressFromEvent(e);
    setDragProgress(p);
    const video = videoRef.current;
    if (video && duration) {
      video.currentTime = (p / 100) * duration;
    }
    showControls();
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e) => {
      const p = getProgressFromEvent(e);
      setDragProgress(p);
      const video = videoRef.current;
      if (video && duration) {
        video.currentTime = (p / 100) * duration;
      }
      showControls();
    };

    const handleEnd = (e) => {
      const p = getProgressFromEvent(e);
      const video = videoRef.current;
      if (video && duration) {
        video.currentTime = (p / 100) * duration;
      }
      setIsDragging(false);
      showControls();
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("touchend", handleEnd);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, duration, getProgressFromEvent, showControls]);

  const changeVolume = (e) => {
    const v = parseFloat(e.target.value);
    if (videoRef.current) videoRef.current.volume = v;
    setVolume(v);
    setMuted(v === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !muted;
    setMuted(!muted);
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!document.fullscreenElement) {
      el?.requestFullscreen()
        .then(() => {
          setFullscreen(true);
          if (screen.orientation && typeof screen.orientation.lock === "function") {
            screen.orientation.lock("landscape").catch((err) => {
              console.warn("Screen orientation lock failed:", err);
            });
          }
        })
        .catch((err) => console.error(err));
    } else {
      document.exitFullscreen();
      setFullscreen(false);
      if (screen.orientation && typeof screen.orientation.unlock === "function") {
        try {
          screen.orientation.unlock();
        } catch (e) {
          console.warn("Screen orientation unlock failed:", e);
        }
      }
    }
  };

  const movie = movieData?.data?.item || movieData?.movie || {};
  const progress = duration ? (currentTime / duration) * 100 : 0;
  const currentProgress = isDragging ? dragProgress : progress;

  return (
    <div
      ref={containerRef}
      className="w-full bg-black min-h-screen flex flex-col"
      onMouseMove={showControls}
      onTouchStart={handleContainerTouchStart}
    >
      {/* Video container */}
      <div
        className="relative flex-1 flex items-center justify-center bg-black"
        style={
          fullscreen
            ? { height: "100vh", maxHeight: "100vh", minHeight: "100vh" }
            : { minHeight: "56.25vw", maxHeight: "85vh" }
        }
      >
        <video ref={videoRef} className="w-full h-full object-contain" />

        {/* Buffering overlay */}
        {buffering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
            <Loader2 size={48} className="text-[#E50914] animate-spin" />
          </div>
        )}

        {/* Embed fallback if HLS fails or no m3u8 */}
        {(!currentEp?.link_m3u8 || videoError) && currentEp?.link_embed && (
          <div className="absolute inset-0 z-20 bg-black">
            <iframe
              src={currentEp.link_embed}
              className="w-full h-full border-none"
              allowFullScreen
              allow="autoplay; encrypted-media"
            />
          </div>
        )}

        {/* Center click area */}
        <div
          className="absolute inset-0 cursor-pointer z-10 center-click-area"
          onClick={handleVideoContainerClick}
          onDoubleClick={toggleFullscreen}
        />

        {shouldShowNextEpisode && (
          <div className="absolute right-4 top-20 z-40 sm:top-24">
            <div className="overflow-hidden rounded-2xl bg-black/75 text-white shadow-xl shadow-black/50 backdrop-blur-md ring-1 ring-white/10">
              <div className="flex items-start gap-3 p-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goNextEp();
                  }}
                  className="flex items-center gap-2 rounded-xl bg-[#E50914] px-3 py-2 text-sm font-semibold transition-colors hover:bg-red-700"
                >
                  <SkipForward size={16} />
                  Tập tiếp theo
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setNextEpisodeDismissedFor(currentEp?.slug || null);
                  }}
                  className="rounded-full p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Ẩn chuyển tập tiếp theo"
                >
                  <X size={15} />
                </button>
              </div>
              {nextEp?.name && (
                <p className="max-w-52 px-3 pb-3 text-xs text-gray-300 line-clamp-1">
                  {nextEp.name}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Center controls overlay */}
        <div
          className={`absolute inset-0 flex items-center justify-center gap-8 bg-black/40 transition-opacity duration-300 z-20 pointer-events-none ${
            controlsVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Skip Back Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              skipSeconds(-10);
              showControls();
            }}
            className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 pointer-events-auto shadow-md"
            title="Lùi 10s"
          >
            <RotateCcw size={20} />
          </button>

          {/* Center Play/Pause Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
              showControls();
            }}
            className="w-16 h-16 rounded-full bg-white text-black hover:bg-white/95 flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 pointer-events-auto shadow-lg"
            title={playing ? "Tạm dừng" : "Phát"}
          >
            {playing ? (
              <Pause size={28} fill="black" />
            ) : (
              <Play size={28} fill="black" className="ml-1" />
            )}
          </button>

          {/* Skip Forward Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              skipSeconds(10);
              showControls();
            }}
            className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 pointer-events-auto shadow-md"
            title="Tới 10s"
          >
            <RotateCw size={20} />
          </button>
        </div>

        {/* Top bar */}
        <div
          className={`absolute top-0 left-0 right-0 p-4 flex items-center gap-3 bg-linear-to-b from-black/70 to-transparent transition-opacity duration-300 z-30 ${
            controlsVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          <Link
            to={`/phim/${slug}`}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate">
              {movie.name}
            </p>
            <p className="text-gray-400 text-xs">
              {currentEp?.name || "Đang tải..."}
            </p>
          </div>
          <button
            onClick={() => setIsFav(toggleFavorite(movie))}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
          >
            <Heart
              size={16}
              className={isFav ? "text-[#E50914]" : "text-white"}
              fill={isFav ? "#E50914" : "transparent"}
            />
          </button>
          <button
            onClick={() => setEpListOpen(!epListOpen)}
            className="flex items-center gap-1.5 text-white/80 hover:text-white text-xs font-medium glass px-3 py-1.5 rounded-full"
          >
            <List size={14} /> Tập phim
          </button>
        </div>

        {/* Bottom controls */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/90 to-transparent px-4 pb-4 pt-8 transition-opacity duration-300 z-30 ${
            controlsVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Progress bar wrapper with larger touch area */}
          <div
            ref={progressBarRef}
            className="relative py-3 cursor-pointer group select-none"
            onMouseDown={handleSeekStart}
            onTouchStart={handleSeekStart}
          >
            <div className="h-2 bg-white/20 rounded-full w-full overflow-hidden">
              <div
                className="h-full bg-[#E50914] rounded-full transition-none"
                style={{ width: `${currentProgress}%` }}
              />
            </div>
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4.5 h-4.5 bg-[#E50914] rounded-full transition-transform scale-100 md:scale-0 md:group-hover:scale-100"
              style={{
                left: `${currentProgress}%`,
                transform: "translate(-50%, -50%)",
              }}
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Prev ep */}
            <button
              onClick={goPrevEp}
              disabled={currentEpIdx <= 0}
              className="text-white/70 hover:text-white disabled:opacity-30 transition-colors"
            >
              <SkipBack size={18} />
            </button>

            {/* Skip back */}
            <button
              onClick={() => skipSeconds(-10)}
              className="text-white/70 hover:text-white transition-colors text-xs font-bold"
            >
              -10
            </button>

            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shrink-0"
            >
              {playing ? (
                <Pause size={18} className="text-black" />
              ) : (
                <Play size={18} className="text-black ml-0.5" />
              )}
            </button>

            {/* Skip forward */}
            <button
              onClick={() => skipSeconds(10)}
              className="text-white/70 hover:text-white transition-colors text-xs font-bold"
            >
              +10
            </button>

            {/* Next ep */}
            <button
              onClick={goNextEp}
              disabled={currentEpIdx >= serverEps.length - 1}
              className="text-white/70 hover:text-white disabled:opacity-30 transition-colors"
            >
              <SkipForward size={18} />
            </button>

            {/* Time */}
            <span className="text-white/70 text-xs font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <div className="flex-1" />

            {/* Volume */}
            <button
              onClick={toggleMute}
              className="text-white/70 hover:text-white transition-colors"
            >
              {muted || volume === 0 ? (
                <VolumeX size={18} />
              ) : (
                <Volume2 size={18} />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              onChange={changeVolume}
              className="w-20 accent-[#E50914] cursor-pointer hidden md:block"
            />

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="text-white/70 hover:text-white transition-colors"
            >
              {fullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          </div>
        </div>

        {/* Episode list drawer */}
        {epListOpen && (
          <div className="absolute top-0 right-0 bottom-0 w-72 bg-[#131313]/95 backdrop-blur-xl flex flex-col z-40">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">Danh sách tập</h3>
              <button
                onClick={() => setEpListOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                &times;
              </button>
            </div>
            {episodes.length > 1 && (
              <div className="flex gap-2 p-3 bg-[#1c1b1b]">
                {episodes.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setActiveServer(i);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${i === activeServer ? "bg-[#E50914] text-white" : "glass text-gray-400"}`}
                  >
                    {s.server_name}
                  </button>
                ))}
              </div>
            )}
            <div className="flex-1 overflow-y-auto p-3 grid grid-cols-4 gap-1.5 content-start">
              {serverEps.map((ep, i) => (
                <button
                  key={i}
                  onClick={() => {
                    navigate(`/xem/${slug}/${ep.slug}?server=${activeServer}`);
                    setEpListOpen(false);
                  }}
                  className={`py-2 rounded-lg text-xs font-semibold transition-all ${currentEp?.slug === ep.slug ? "bg-[#E50914] text-white" : "glass glass-hover text-gray-400 hover:text-white"}`}
                >
                  {ep.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Below player info */}
      {!fullscreen && (
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-xl font-bold text-white mb-1">
            {movie.name} — {currentEp?.name}
          </h1>
          <p className="text-sm text-gray-500 mb-4">{movie.origin_name}</p>
          <div className="flex gap-2">
            <Link
              to={`/phim/${slug}`}
              className="glass hover:bg-white/10 text-sm font-medium px-4 py-2 rounded-full transition-all text-gray-300"
            >
              ← Thông tin phim
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
