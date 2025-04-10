
import React from 'react';
import { cn } from '@/lib/utils';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface TimeSlotSelectorProps {
  date: Date;
  slots: TimeSlot[];
  selectedSlot: string | null;
  onSelectSlot: (slotId: string) => void;
}

const TimeSlotSelector = ({ 
  date, 
  slots, 
  selectedSlot, 
  onSelectSlot 
}: TimeSlotSelectorProps) => {
  // Format the date as "Mon, 10 Apr"
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });
  
  return (
    <div className="mb-6">
      <h3 className="font-medium mb-3">Available slots for {formattedDate}</h3>
      
      <div className="grid grid-cols-3 gap-2">
        {slots.map((slot) => (
          <button
            key={slot.id}
            className={cn(
              "py-2 rounded-lg text-center text-sm font-medium transition-colors",
              slot.available 
                ? selectedSlot === slot.id
                  ? "bg-cng-primary text-white"
                  : "bg-white border border-slate-200 text-slate-700 hover:border-cng-primary"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            )}
            onClick={() => slot.available && onSelectSlot(slot.id)}
            disabled={!slot.available}
          >
            {slot.time}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeSlotSelector;
