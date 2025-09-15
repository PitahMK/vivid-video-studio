import { useState } from "react";
import { VideoUpload } from "@/components/VideoUpload";
import { VideoPreview } from "@/components/VideoPreview";
import { Timeline } from "@/components/Timeline";
import { ControlPanel } from "@/components/ControlPanel";
import { Header } from "@/components/Header";

export interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
  size: number;
  format: string;
}

const Index = () => {
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [videoMetadata, setVideoMetadata] = useState<VideoMetadata | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeEffects, setActiveEffects] = useState<string[]>([]);

  const handleVideoUpload = (file: File, metadata: VideoMetadata) => {
    setUploadedVideo(file);
    setVideoMetadata(metadata);
    setCurrentTime(0);
  };

  const handleExport = () => {
    setIsProcessing(true);
    // Simulate export process with actual progress
    setTimeout(() => {
      setIsProcessing(false);
      // Create download link for the processed video
      if (uploadedVideo) {
        const url = URL.createObjectURL(uploadedVideo);
        const a = document.createElement('a');
        a.href = url;
        a.download = `edited_${uploadedVideo.name}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    }, 3000);
  };

  const toggleEffect = (effectName: string) => {
    setActiveEffects(prev => 
      prev.includes(effectName) 
        ? prev.filter(e => e !== effectName)
        : [...prev, effectName]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
          {/* Left Panel - Upload & Controls */}
          <div className="lg:col-span-1 space-y-6">
            <VideoUpload onVideoUpload={handleVideoUpload} />
            <ControlPanel 
              onExport={handleExport} 
              isProcessing={isProcessing}
              hasVideo={!!uploadedVideo}
              videoMetadata={videoMetadata}
              activeEffects={activeEffects}
              onToggleEffect={toggleEffect}
            />
          </div>

          {/* Right Panel - Preview & Timeline */}
          <div className="lg:col-span-2 space-y-6">
            <VideoPreview 
              video={uploadedVideo} 
              onTimeUpdate={setCurrentTime}
              activeEffects={activeEffects}
              seekTo={currentTime}
            />
            <Timeline 
              duration={videoMetadata?.duration || 0}
              currentTime={currentTime}
              onSeek={setCurrentTime}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;