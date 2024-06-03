import Image from 'next/image';
import { ImageWithFallbackProps } from '../types/types';

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ imageSrc, alt, placeholder }) => {
  return (
    <div className="relative h-64" style={{ width: 'auto', aspectRatio: '2 / 3' }}> {/* Fixed height of 256px */}
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={alt}
          title={alt}
          fill
        />
      ) : (
        <div className="placeholder-box" title={alt}>
          {placeholder}
        </div>
      )}
    </div>
  );
};

export default ImageWithFallback;
