import Image from 'next/image';
import { ImageWithFallbackProps } from '../types/types';

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ imageSrc, alt, placeholder }) => {
  return (
    <div className="relative w-full pb-[150%]"> {/* Maintain 2:3 aspect ratio */}
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={alt}
          title={alt}
          fill
          className="absolute inset-0 object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex" title={alt}>
          {placeholder}
        </div>
      )}
    </div>
  );
};

export default ImageWithFallback;
