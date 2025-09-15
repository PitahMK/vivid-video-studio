import { Button } from "@/components/ui/button";
import { Play, Settings, Download } from "lucide-react";

export const Header = () => {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg video-creator-gradient flex items-center justify-center">
              <Play className="w-4 h-4 text-primary-foreground" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">VideoFlow</h1>
              <p className="text-xs text-muted-foreground">Modern Video Creator</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="default" size="sm" className="video-creator-gradient">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};