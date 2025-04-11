
import { useEffect, useState } from "react";

export function useIsCapacitor() {
  const [isCapacitor, setIsCapacitor] = useState<boolean>(false);

  useEffect(() => {
    // Check if we're running in a Capacitor native app
    const checkCapacitor = () => {
      try {
        return typeof window !== 'undefined' && 
               window !== null && 
               'Capacitor' in window && 
               window.Capacitor !== undefined;
      } catch (e) {
        console.log('Error checking for Capacitor:', e);
        return false;
      }
    };
    
    setIsCapacitor(checkCapacitor());
  }, []);

  return isCapacitor;
}
