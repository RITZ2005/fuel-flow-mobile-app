
import React from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface StationMapProps {
  latitude: number;
  longitude: number;
}

const StationMap: React.FC<StationMapProps> = ({ latitude, longitude }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-full h-48 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
          <iframe
            title="Station Location"
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.01},${latitude-0.01},${longitude+0.01},${latitude+0.01}&layer=mapnik&marker=${latitude},${longitude}`}
          />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] h-[80vh]">
        <div className="w-full h-full">
          <iframe
            title="Station Location (Large)"
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.02},${latitude-0.02},${longitude+0.02},${latitude+0.02}&layer=mapnik&marker=${latitude},${longitude}`}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StationMap;
