// components/BookFlippingLoader.js
import React from "react";

const BookFlippingLoader = () => {
  return (
    <div className="flex flex-col space-y-4 items-center justify-center">
      <div className="flex justify-center items-center w-24 h-24 perspective-1000">
        <div className="relative w-16 h-20 transform-style-preserve-3d animate-flip">
          <div className="absolute w-full h-full bg-primary shadow-md border border-primary transform origin-left backface-hidden"></div>
          <div className="absolute w-full h-full bg-secondary shadow-md border border-secondary transform origin-left rotate-y-180 backface-hidden"></div>
          <div className="absolute w-full h-full bg-white shadow-md border border-secondary transform origin-left rotate-y-90 backface-hidden"></div>
          <div className="absolute w-full h-full bg-white shadow-md border border-secondary transform origin-left rotate-y-270 backface-hidden"></div>
        </div>
      </div>
      <p>Looking through your library...</p>
    </div>
  );
};

export default BookFlippingLoader;
