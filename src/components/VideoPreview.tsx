import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, Maximize, RotateCcw } from "lucide-react";

interface VideoPreviewProps {
  video: File | null;
  onTimeUpdate?: (time: number) => void;
  activeEffects?: string[];
  seekTo?: number;
}

export const VideoPreview = ({ video, onTimeUpdate, activeEffects = [], seekTo }: VideoPreviewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string>("");

  useEffect(() => {
    if (video) {
      const url = URL.createObjectURL(video);
      setVideoUrl(url);
      
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [video]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const time = videoRef.current.currentTime;
    setCurrentTime(time);
    onTimeUpdate?.(time);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  // Sync external seek requests from Timeline
  useEffect(() => {
    if (!videoRef.current) return;
    if (typeof seekTo === 'number' && !Number.isNaN(seekTo)) {
      const diff = Math.abs(videoRef.current.currentTime - seekTo);
      if (diff > 0.2) {
        videoRef.current.currentTime = seekTo;
        setCurrentTime(seekTo);
      }
    }
  }, [seekTo]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const newTime = Number(e.target.value);
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getVideoStyle = () => {
    let style = "w-full h-full object-contain rounded-lg";
    
    if (activeEffects.includes("Blur")) {
      style += " blur-sm";
    }
    if (activeEffects.includes("Sepia")) {
      style += " sepia";
    }
    if (activeEffects.includes("B&W")) {
      style += " grayscale";
    }
    
    return style;
  };

  return (
    <Card className="p-6 card-shadow h-full">
      <div className="space-y-4 h-full">
        <h2 className="text-lg font-semibold flex items-center">
          <Play className="w-5 h-5 text-primary mr-2" />
          Preview
        </h2>

        <div className="relative bg-video-bg rounded-lg overflow-hidden flex-1 flex items-center justify-center min-h-[300px]">
          {video ? (
            <>
              <video
                ref={videoRef}
                src={videoUrl}
                className={getVideoStyle()}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
              />
              
              {/* Video Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="space-y-2">
                  {/* Progress Bar */}
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 bg-white/20 rounded-lg appearance-none slider"
                  />
                  
                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={togglePlay}
                        className="text-white hover:bg-white/20"
                      >
                        {isPlaying ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white hover:bg-white/20"
                      >
                        <Volume2 className="w-4 h-4" />
                      </Button>
                      
                      <span className="text-white text-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white hover:bg-white/20"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white hover:bg-white/20"
                      >
                        <Maximize className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-muted-foreground">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                <Play className="w-12 h-12" />
              </div>
              <p className="text-lg font-medium">No video selected</p>
              <p className="text-sm">Upload a video to start editing</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};