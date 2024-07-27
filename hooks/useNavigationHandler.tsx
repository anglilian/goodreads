// hooks/useNavigationHandler.tsx
import { useEffect, useState } from "react";

const useNavigationHandler = (componentsLength: number) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        setCurrentIndex((prevIndex) => (prevIndex + 1) % componentsLength);
      }
    };

    const handleTouchStart = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % componentsLength);
    };

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("touchstart", handleTouchStart);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, [componentsLength]);

  return currentIndex;
};

export default useNavigationHandler;
