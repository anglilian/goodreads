import React, { useState, useEffect } from 'react';
import { fetchBookCover } from '../utils';

interface ImageWithFallbackProps {
  isbn?: string;
  title?: string;
  authorLf?: string;
  alt: string;
  placeholder: React.ReactNode;
  sizeClass: string;  // Make sizeClass required
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ isbn, title, authorLf, alt, placeholder, sizeClass }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      const coverImage = await fetchBookCover(isbn, title, authorLf);
      if (coverImage) {
        setImageSrc(coverImage);
        setIsImageLoaded(true);
      } else {
        setIsImageLoaded(false);
      }
    };

    loadImage();
  }, [isbn, title, authorLf]);

  return (
    <div className={`${sizeClass} flex items-center justify-center`}>
      {isImageLoaded && imageSrc ? (
        <img src={imageSrc} alt={alt} title={alt} className="w-auto h-full object-cover" />
      ) : (
        <div className={`w-full h-full placeholder-box`} title={alt}>
          {placeholder}
        </div>
      )}
    </div>
  );
};

export default ImageWithFallback;
