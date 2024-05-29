import React, { useState, useEffect } from 'react';
import { fetchBookCover } from '../utils';
import Image from 'next/image';

interface ImageWithFallbackProps {
  isbn?: string;
  title?: string;
  authorLf?: string;
  alt: string;
  placeholder: React.ReactNode;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ isbn, title, authorLf, alt, placeholder}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const sizeClass = "h-40 w-24 sm:h-48 sm:w-32 md:h-56 md:w-40 lg:h-64 lg:w-48";  // Define responsive size classes

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
        <Image src={imageSrc} alt={alt} title={alt} className="w-full h-full object-cover" width="200" height="300" />
      ) : (
        <div className={`w-auto h-full placeholder-box`} title={alt}>
          {placeholder}
        </div>
      )}
    </div>
  );
};

export default ImageWithFallback;
