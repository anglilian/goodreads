import React, { useEffect, useState } from "react";
import html2canvas from "html2canvas";

interface ExportImageProps {
  componentRef: React.RefObject<HTMLDivElement>;
}

const ExportImage: React.FC<ExportImageProps> = ({ componentRef }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (componentRef.current) {
      setIsMounted(true);
    }
  }, [componentRef]);

  const handleExportAsImage = () => {
    if (componentRef.current) {
      const originalWidth = componentRef.current.clientWidth;
      const originalHeight = componentRef.current.clientHeight;

      const width = 1080; // Desired width for Instagram story
      const height = 1920; // Desired height for Instagram story

      // Apply uniform scaling to the component
      const scale = Math.min(width / originalWidth, height / originalHeight);

      // Temporarily set the dimensions for html2canvas
      componentRef.current.style.width = `${originalWidth}px`;
      componentRef.current.style.height = `${originalHeight}px`;
      componentRef.current.style.transform = `scale(${scale})`;
      componentRef.current.style.transformOrigin = "top left";

      html2canvas(componentRef.current, {
        width: width,
        height: height,
        scale: 1,
        useCORS: true,
      }).then((canvas) => {
        // Reset the scaling and dimensions
        componentRef.current.style.transform = "none";

        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "exported-image.png";
        link.click();
      });
    }
  };

  return (
    <button onClick={handleExportAsImage} disabled={!isMounted}>
      Export as Image
    </button>
  );
};

export default ExportImage;
