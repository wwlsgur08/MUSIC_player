import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Download, Volume2, VolumeX } from 'lucide-react';
import { getDominantCategory } from '../utils/charmCategories';

interface MusicTrack {
  id: string;
  name: string;
  traits: { charm_name: string; stage: number }[];
  duration: number;
  audioUrl: string;
  createdAt: number;
}

interface MusicPlayerProps {
  track: MusicTrack;
}

export function MusicPlayer({ track }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 트랙의 지배적인 카테고리 색상 가져오기
  const dominantCategory = getDominantCategory(track.traits);

  useEffect(() => {
    // 트랙이 변경되면 재생 중지
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [track.id]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || track.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl p-8 border-2 border-slate-700/50 shadow-2xl">
      {/* LP Record Container */}
      <div className="relative mb-8">
        <div className="aspect-square max-w-md mx-auto relative">
          {/* Vinyl Record */}
          <div 
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${dominantCategory.color.from} ${dominantCategory.color.to} shadow-2xl transition-all duration-500 ease-in-out ${
              isPlaying ? 'animate-spin' : ''
            }`}
            style={{ animationDuration: '3s' }}
          >
            {/* Record Grooves */}
            <div className="absolute inset-8 rounded-full border-4 border-black/20" />
            <div className="absolute inset-16 rounded-full border-4 border-black/20" />
            <div className="absolute inset-24 rounded-full border-4 border-black/20" />
            
            {/* Center Label */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-white/90 to-white/80 shadow-xl flex items-center justify-center border-4 border-white/30">
              <div className="text-center">
                <div className="text-2xl mb-1">✨</div>
                <div className="text-xs text-gray-700">Aster</div>
                <div className="text-xs text-gray-700">Alarm</div>
              </div>
            </div>
          </div>

          {/* Tonearm (Stylus) */}
          <div 
            className={`absolute -right-4 top-1/4 w-32 h-2 bg-gradient-to-r from-gray-700 to-gray-500 rounded-full shadow-lg origin-left transition-transform duration-500 ${
              isPlaying ? 'rotate-12' : '-rotate-12'
            }`}
            style={{ transformOrigin: '0% 50%' }}
          >
            <div className="absolute right-0 w-4 h-4 bg-red-500 rounded-full shadow-lg" />
          </div>
        </div>
      </div>

      {/* Track Info */}
      <div className="text-center mb-6">
        <h2 className="text-white text-2xl mb-2">{track.name}의 매력 음악</h2>
        <div className={`inline-block px-4 py-1.5 bg-gradient-to-r ${dominantCategory.color.from} ${dominantCategory.color.to} rounded-full text-white text-sm mb-3 shadow-lg`}>
          {dominantCategory.name}
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {track.traits.map((trait, index) => (
            <span 
              key={index}
              className={`px-3 py-1 ${dominantCategory.color.from.replace('from-', 'bg-')}/20 ${dominantCategory.color.text} rounded-full text-sm border ${dominantCategory.color.border}/50`}
            >
              {trait.charm_name} Lv.{trait.stage}
            </span>
          ))}
        </div>
        <p className={`${dominantCategory.color.text} text-sm`}>
          {formatTime(duration)} • {new Date(track.createdAt).toLocaleDateString('ko-KR')}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className={`w-full h-2 ${dominantCategory.color.from.replace('from-', 'bg-')}/30 rounded-lg appearance-none cursor-pointer slider`}
        />
        <div className={`flex justify-between ${dominantCategory.color.text} text-sm mt-2`}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          onClick={togglePlay}
          className={`w-16 h-16 rounded-full bg-gradient-to-br ${dominantCategory.color.from} ${dominantCategory.color.to} hover:brightness-110 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105`}
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 text-white" />
          ) : (
            <Play className="w-8 h-8 text-white ml-1" />
          )}
        </button>

        <button
          className={`w-12 h-12 rounded-full ${dominantCategory.color.from.replace('from-', 'bg-')}/30 hover:${dominantCategory.color.from.replace('from-', 'bg-')}/50 flex items-center justify-center transition-all duration-200 hover:scale-105 border ${dominantCategory.color.border}/50`}
        >
          <Download className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-3">
        <button onClick={toggleMute} className={`${dominantCategory.color.text} hover:text-white transition-colors`}>
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className={`flex-1 h-2 ${dominantCategory.color.from.replace('from-', 'bg-')}/30 rounded-lg appearance-none cursor-pointer slider`}
        />
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={track.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(135deg, #a855f7, #ec4899);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(168, 85, 247, 0.5);
        }

        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(135deg, #a855f7, #ec4899);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(168, 85, 247, 0.5);
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}