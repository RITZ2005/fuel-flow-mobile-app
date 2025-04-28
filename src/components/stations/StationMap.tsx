
import React from 'react';

interface StationMapProps {
  latitude: number;
  longitude: number;
}

const StationMap: React.FC<StationMapProps> = ({ latitude, longitude }) => {
  return (
    <div className="w-full h-48 rounded-lg overflow-hidden">
      <iframe
        title="Station Location"
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.01},${latitude-0.01},${longitude+0.01},${latitude+0.01}&layer=mapnik&marker=${latitude},${longitude}`}
      />
    </div>
  );
};

export default StationMap;
