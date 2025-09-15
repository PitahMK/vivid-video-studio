import { useState } from "react";
import { VideoUpload } from "@/components/VideoUpload";
import { VideoPreview } from "@/components/VideoPreview";
import { Timeline } from "@/components/Timeline";
import { ControlPanel } from "@/components/ControlPanel";
import { Header } from "@/components/Header";

const Index = () => {
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleVideoUpload = (file: File) => {
    setUploadedVideo(file);
  };

  const handleExport = () => {
    setIsProcessing(true);
    // Simulate export process
    setTimeout(() => {
      setIsProcessing(false);
    }, 3000);
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
            />
          </div>

          {/* Right Panel - Preview & Timeline */}
          <div className="lg:col-span-2 space-y-6">
            <VideoPreview video={uploadedVideo} />
            <Timeline />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;