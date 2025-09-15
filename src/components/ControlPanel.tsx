import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { VideoMetadata } from "@/pages/Index";
import { 
  Download, 
  Settings, 
  Palette, 
  Filter, 
  Type, 
  Music, 
  Zap,
  Loader2
} from "lucide-react";

interface ControlPanelProps {
  onExport: () => void;
  isProcessing: boolean;
  hasVideo: boolean;
  videoMetadata: VideoMetadata | null;
  activeEffects: string[];
  onToggleEffect: (effectName: string) => void;
}

export const ControlPanel = ({ onExport, isProcessing, hasVideo, videoMetadata, activeEffects = [], onToggleEffect }: ControlPanelProps) => {
  const effects = [
    { name: "Fade In", icon: Zap },
    { name: "Blur", icon: Filter },
    { name: "Sepia", icon: Palette },
    { name: "B&W", icon: Filter },
  ];

  return (
    <div className="space-y-6">
      {/* Export Section */}
      <Card className="p-6 card-shadow">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center">
            <Download className="w-5 h-5 text-primary mr-2" />
            Export
          </h2>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={!hasVideo}
                className="justify-start"
              >
                <span className="text-xs">1080p MP4</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={!hasVideo}
                className="justify-start"
              >
                <span className="text-xs">720p MP4</span>
              </Button>
            </div>
            
            <Button 
              onClick={onExport}
              disabled={!hasVideo || isProcessing}
              className="w-full video-creator-gradient"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export Video
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Effects Section */}
      <Card className="p-6 card-shadow">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center">
            <Palette className="w-5 h-5 text-primary mr-2" />
            Effects
          </h2>
          
          <div className="grid grid-cols-2 gap-2">
            {effects.map((effect) => {
              const isActive = activeEffects.includes(effect.name);
              return (
                <Button
                  key={effect.name}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  className="justify-start relative"
                  disabled={!hasVideo}
                  onClick={() => onToggleEffect(effect.name)}
                >
                  <effect.icon className="w-4 h-4 mr-2" />
                  <span className="text-xs">{effect.name}</span>
                  {isActive && (
                    <Badge 
                      variant="secondary" 
                      className="absolute -top-1 -right-1 h-4 px-1 text-xs"
                    >
                      ✓
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Tools Section */}
      <Card className="p-6 card-shadow">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center">
            <Settings className="w-5 h-5 text-primary mr-2" />
            Tools
          </h2>
          
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start"
              disabled={!hasVideo}
            >
              <Type className="w-4 h-4 mr-2" />
              Add Text
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start"
              disabled={!hasVideo}
            >
              <Music className="w-4 h-4 mr-2" />
              Add Music
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start"
              disabled={!hasVideo}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Project Info */}
      <Card className="p-4 card-shadow">
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Resolution:</span>
            <span>
              {videoMetadata ? `${videoMetadata.width}×${videoMetadata.height}` : "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Duration:</span>
            <span>
              {videoMetadata ? 
                `${Math.floor(videoMetadata.duration / 60)}:${Math.floor(videoMetadata.duration % 60).toString().padStart(2, '0')}` : 
                "—"
              }
            </span>
          </div>
          <div className="flex justify-between">
            <span>Format:</span>
            <span>{videoMetadata?.format || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span>Size:</span>
            <span>
              {videoMetadata ? 
                `${(videoMetadata.size / (1024 * 1024)).toFixed(1)} MB` : 
                "—"
              }
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};