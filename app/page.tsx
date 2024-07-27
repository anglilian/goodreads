"use client";

import React, { useState, useRef } from "react";
import "./globals.css"; // Ensure this is imported to apply the styles
import useBooksData from "@/hooks/useBooksData"; // Adjust the path according to your project structure
import TopGenres from "@/components/TopGenres";
import BookTable from "@/components/BookTable";
import TotalPagesRead from "@/components/TotalPagesRead";
import BookComparison from "@/components/BookComparison";
import BookFlippingLoader from "@/components/BookFlippingLoader";
import Start from "@/components/Start";
import ExportImage from "@/components/ExportImage";
import FileUpload from "@/components/FileUpload";
import useNavigationHandler from "@/hooks/useNavigationHandler";

const Home: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [userBooks, isLoading] = useBooksData(uploadedFile, currentYear);
  const componentRef = useRef<HTMLDivElement>(null);

  const components = [
    <BookComparison key="1" books={userBooks} />,
    <TopGenres key="2" books={userBooks} />,
    <TotalPagesRead key="3" books={userBooks} />,
    <BookTable key="4" books={userBooks} />, // Display user books
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
    <div className="flex flex-col items-center justify-center min-h-screen overflow-hidden text-center">
      {isLoading ? (
        <BookFlippingLoader />
      ) : (
        <div>
          {!uploadedFile ? (
            <>
              <Start year={currentYear} />
              <FileUpload onFileUpload={handleFileUpload} />
            </>
          ) : (
            <div className="space-y-4">
              <div
                className="w-full mr-2 ml-2 flex items-center justify-center"
                ref={componentRef}
              >
                {components[currentIndex]}
              </div>
              <p className="mt-2">Click Enter or tap to continue</p>
              <ExportImage componentRef={componentRef} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
