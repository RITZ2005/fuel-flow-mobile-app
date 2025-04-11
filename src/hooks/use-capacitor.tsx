
import { useEffect, useState } from "react";

export function useIsCapacitor() {
  const [isCapacitor, setIsCapacitor] = useState<boolean>(false);

  useEffect(() => {
    // Check if we're running in a Capacitor native app
    const checkCapacitor = () => {
      return window.Capacitor !== undefined;
    };
    
    setIsCapacitor(checkCapacitor());
  }, []);

  return isCapacitor;
}
