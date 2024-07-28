"use client";

import React, { useState, useRef } from "react";
import "./globals.css"; // Ensure this is imported to apply the styles
import useBooksData from "@/hooks/useBooksData"; // Adjust the path according to your project structure
import BookFlippingLoader from "@/components/BookFlippingLoader";
import Start from "@/components/Start";
import ExportImage from "@/components/ExportImage";
import FileUpload from "@/components/FileUpload";
import ScrollingPage from "@/components/ScrollingPage";
import BookComparison from "@/components/BookComparison";
import TopGenres from "@/components/TopGenres";
import useNavigationHandler from "@/hooks/useNavigationHandler";

const Home: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [userBooks, isLoading] = useBooksData(uploadedFile, currentYear);
  const componentRef = useRef<HTMLDivElement>(null);

  const components = [
    <ScrollingPage key="0" books={userBooks} />,
    <BookComparison key="1" books={userBooks} />,
    <TopGenres key="2" books={userBooks} />,
  ];

  const currentIndex = useNavigationHandler(components.length);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setUploadedFile(file);
    }
  };

  return (
    <div className="flex flex-col items-center h-screen justify-center text-center w-full p-2">
      {isLoading ? (
        <BookFlippingLoader />
      ) : (
        <div className="w-full items-center justify-center flex flex-col">
          {!uploadedFile ? (
            <>
              <Start year={currentYear} />
              <FileUpload onFileUpload={handleFileUpload} />
            </>
          ) : (
            <div className="space-y-4 w-full flex flex-col items-center justify-center">
              <div
                className="w-full h-full flex items-center justify-center"
                ref={componentRef}
              >
                {components[currentIndex]}
              </div>
              {/* <ExportImage componentRef={componentRef} /> */}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
