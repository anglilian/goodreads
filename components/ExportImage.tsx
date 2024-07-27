// components/ExportImage.tsx
import React, { useRef } from "react";
import html2canvas from "html2canvas";

interface ExportImageProps {
  componentRef: React.RefObject<HTMLDivElement>;
}

const ExportImage: React.FC<ExportImageProps> = ({ componentRef }) => {
  const handleExportAsImage = () => {
    if (componentRef.current) {
      html2canvas(componentRef.current).then((canvas) => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "exported-image.png";
        link.click();
      });
    }
  };

  return <button onClick={handleExportAsImage}>Export as Image</button>;
};

export default ExportImage;
