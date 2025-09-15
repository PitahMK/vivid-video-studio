import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scissors, Volume2, Wand2, Layers } from "lucide-react";

interface TimelineProps {
  duration: number;
  currentTime: number;
  onSeek: (time: number) => void;
}

export const Timeline = ({ duration, currentTime, onSeek }: TimelineProps) => {
  return (
    <Card className="p-6 card-shadow">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center">
            <Layers className="w-5 h-5 text-primary mr-2" />
            Timeline
          </h2>
          
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline">
              <Scissors className="w-4 h-4 mr-2" />
              Cut
            </Button>
            <Button size="sm" variant="outline">
              <Volume2 className="w-4 h-4 mr-2" />
              Audio
            </Button>
            <Button size="sm" variant="outline">
              <Wand2 className="w-4 h-4 mr-2" />
              Effects
            </Button>
          </div>
        </div>

        {/* Timeline Track */}
        <div className="bg-timeline rounded-lg p-4 min-h-[120px]">
          <div className="space-y-3">
            {/* Time Ruler */}
            <div className="flex items-center justify-between text-xs text-timeline-foreground mb-4">
              {duration > 0 ? (
                Array.from({ length: 6 }, (_, i) => {
                  const time = (duration / 5) * i;
                  const minutes = Math.floor(time / 60);
                  const seconds = Math.floor(time % 60);
                  return (
                    <span key={i}>
                      {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                    </span>
                  );
                })
              ) : (
                <>
                  <span>00:00</span>
                  <span>--:--</span>
                  <span>--:--</span>
                  <span>--:--</span>
                  <span>--:--</span>
                </>
              )}
            </div>
            
            {/* Video Track */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="text-xs text-timeline-foreground w-12">Video</div>
                <div 
                  className="flex-1 h-8 bg-control-bg rounded border border-border relative overflow-hidden cursor-pointer"
                  onClick={(e) => {
                    if (duration > 0) {
                      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                      const clickX = e.clientX - rect.left;
                      const newTime = (clickX / rect.width) * duration;
                      onSeek(Math.max(0, Math.min(duration, newTime)));
                    }
                  }}
                >
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="h-full bg-gradient-to-r from-primary/20 to-primary/10 rounded flex items-center px-2">
                      <div className="text-xs text-foreground font-medium">Video Track</div>
                    </div>
                  </div>
                  {/* Progress Fill */}
                  <div 
                    className="absolute top-0 left-0 h-full bg-primary/30"
                    style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
                  ></div>
                  {/* Playhead */}
                  <div 
                    className="absolute top-0 w-0.5 h-full bg-primary z-10"
                    style={{ left: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
                  ></div>
                </div>
              </div>
              
              {/* Audio Track */}
              <div className="flex items-center space-x-2">
                <div className="text-xs text-timeline-foreground w-12">Audio</div>
                <div className="flex-1 h-6 bg-control-bg rounded border border-border relative overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-accent/20 to-accent/10 rounded flex items-center px-2">
                    <div className="flex space-x-0.5 items-center">
                      {Array.from({ length: 40 }, (_, i) => (
                        <div 
                          key={i} 
                          className="w-0.5 bg-accent/60 rounded" 
                          style={{ height: `${Math.random() * 12 + 4}px` }}
                        />
                      ))}
                    </div>
                  </div>
                  {/* Playhead */}
                  <div 
                    className="absolute top-0 w-0.5 h-full bg-primary cursor-pointer z-10"
                    style={{ left: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Controls */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>Zoom: 100%</span>
            <div className="flex space-x-1">
              <Button size="sm" variant="ghost" className="h-6 px-2">-</Button>
              <Button size="sm" variant="ghost" className="h-6 px-2">+</Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span>Duration: {duration > 0 ? `${Math.floor(duration / 60)}:${Math.floor(duration % 60).toString().padStart(2, '0')}` : '--:--'}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};