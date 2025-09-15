import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Video, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { VideoMetadata } from "@/pages/Index";

interface VideoUploadProps {
  onVideoUpload: (file: File, metadata: VideoMetadata) => void;
}

export const VideoUpload = ({ onVideoUpload }: VideoUploadProps) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const getVideoMetadata = (file: File): Promise<VideoMetadata> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        const metadata: VideoMetadata = {
          duration: video.duration,
          width: video.videoWidth,
          height: video.videoHeight,
          size: file.size,
          format: file.type.split('/')[1].toUpperCase()
        };
        URL.revokeObjectURL(video.src);
        resolve(metadata);
      };
      
      video.src = URL.createObjectURL(file);
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      toast.error("Please upload a video file");
      return;
    }

    // Validate file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      toast.error("File size must be less than 100MB");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Get video metadata
      const metadata = await getVideoMetadata(file);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            onVideoUpload(file, metadata);
            toast.success("Video uploaded successfully!");
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    } catch (error) {
      setIsUploading(false);
      toast.error("Failed to process video file");
    }
  }, [onVideoUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm']
    },
    multiple: false,
  });

  return (
    <Card className="p-6 card-shadow">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Video className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Upload Video</h2>
        </div>

        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
            ${isDragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-primary/50 hover:bg-primary/5'
            }
          `}
        >
          <input {...getInputProps()} />
          
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-secondary flex items-center justify-center">
              <Upload className="w-8 h-8 text-muted-foreground" />
            </div>
            
            {isUploading ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Uploading... {uploadProgress}%</p>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <>
                <div>
                  <p className="text-sm font-medium">
                    {isDragActive ? "Drop the video here" : "Drag & drop a video, or click to browse"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports MP4, AVI, MOV, WMV, FLV, WebM (max 100MB)
                  </p>
                </div>
                
                <Button variant="outline" className="mt-4">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="flex items-start space-x-2 text-xs text-muted-foreground">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>Your videos are processed locally and never uploaded to external servers.</p>
        </div>
      </div>
    </Card>
  );
};