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

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ isbn, title, authorLf, alt, placeholder }) => {
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
    <div className="relative h-64" style={{ width: 'auto', aspectRatio: '2 / 3' }}> {/* Fixed height of 256px */}
      {isImageLoaded && imageSrc ? (
        <Image
          src={imageSrc}
          alt={alt}
          title={alt}
          layout="fill"
          objectFit="contain"
          className="object-contain"
        />
      ) : (
        <div className="placeholder-box h-64 aspect-[2/3]" title={alt}>
          {placeholder}
        </div>
      )}
    </div>
  );
};

export default ImageWithFallback;
