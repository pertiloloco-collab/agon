"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2 } from "lucide-react";

interface AudioPlayerProps {
  audioUrl?: string;
  audioBuffer?: ArrayBuffer;
}

export function AudioPlayer({ audioUrl, audioBuffer }: AudioPlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number>(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  // Create object URL from buffer
  useEffect(() => {
    if (audioBuffer) {
      const blob = new Blob([audioBuffer], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      setObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [audioBuffer]);

  const resolvedUrl = audioUrl || objectUrl;

  // Initialize audio element
  useEffect(() => {
    if (!resolvedUrl) return;

    const audio = new Audio(resolvedUrl);
    audioRef.current = audio;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
      audio.src = "";
    };
  }, [resolvedUrl]);

  // Setup Web Audio API for waveform
  const setupAudioContext = useCallback(() => {
    if (audioContextRef.current || !audioRef.current) return;

    const ctx = new AudioContext();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 128;

    const source = ctx.createMediaElementSource(audioRef.current);
    source.connect(analyser);
    analyser.connect(ctx.destination);

    audioContextRef.current = ctx;
    analyserRef.current = analyser;
    sourceRef.current = source;
  }, []);

  // Draw waveform
  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const barCount = 32;
      const barWidth = width / barCount - 2;
      const step = Math.floor(bufferLength / barCount);

      for (let i = 0; i < barCount; i++) {
        const value = dataArray[i * step] / 255;
        const barHeight = Math.max(2, value * height * 0.85);

        const gradient = ctx.createLinearGradient(
          0,
          height - barHeight,
          0,
          height
        );
        gradient.addColorStop(0, "#C9A84C");
        gradient.addColorStop(1, "#8B7432");

        ctx.fillStyle = gradient;
        ctx.fillRect(
          i * (barWidth + 2),
          height - barHeight,
          barWidth,
          barHeight
        );
      }
    };

    draw();
  }, []);

  // Cleanup animation frame
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const togglePlayPause = async () => {
    if (!audioRef.current) return;

    if (!audioContextRef.current) {
      setupAudioContext();
    }

    if (isPlaying) {
      audioRef.current.pause();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    } else {
      await audioRef.current.play();
      drawWaveform();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    audioRef.current.currentTime = pct * duration;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!resolvedUrl) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="rounded-xl border border-[#1F1F1F] bg-[#111111] p-4"
      >
        <div className="flex items-center gap-4">
          {/* Play/Pause */}
          <button
            onClick={togglePlayPause}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 text-[#C9A84C] transition-colors hover:bg-[#C9A84C]/20"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4 ml-0.5" />
            )}
          </button>

          {/* Waveform + Progress */}
          <div className="flex-1 space-y-2">
            {/* Canvas Waveform */}
            <canvas
              ref={canvasRef}
              width={300}
              height={40}
              className="w-full h-10 rounded"
            />

            {/* Progress bar */}
            <div
              className="h-1.5 w-full cursor-pointer rounded-full bg-[#1F1F1F]"
              onClick={handleProgressClick}
              role="progressbar"
              aria-valuenow={currentTime}
              aria-valuemin={0}
              aria-valuemax={duration}
            >
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#C9A84C] to-[#E8D48B]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Duration */}
          <div className="flex flex-shrink-0 items-center gap-2 text-xs">
            <Volume2 className="h-3 w-3 text-[#525252]" />
            <span className="font-mono text-[#A3A3A3]">
              {formatTime(currentTime)}/{formatTime(duration)}
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
