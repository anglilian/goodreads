"use client";

import React, { useState, useRef } from "react";
import "./globals.css"; // Ensure this is imported to apply the styles
import useBooksData from "@/hooks/useBooksData"; // Adjust the path according to your project structure
import BookFlippingLoader from "@/components/BookFlippingLoader";
import Start from "@/components/Start";
import ExportImage from "@/components/ExportImage";
import FileUpload from "@/components/FileUpload";
import ScrollingPage from "@/components/ScrollingPage";

const Home: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [userBooks, isLoading] = useBooksData(uploadedFile, currentYear);
  const componentRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setUploadedFile(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center w-full p-2">
      {isLoading ? (
        <BookFlippingLoader />
      ) : (
        <div className="w-full h-full items-center justify-center flex flex-col">
          {!uploadedFile ? (
            <>
              <Start year={currentYear} />
              <FileUpload onFileUpload={handleFileUpload} />
            </>
          ) : (
            <div className="space-y-4 w-full h-full flex flex-col items-center justify-center">
              <div
                className="w-full h-full flex items-center justify-center"
                ref={componentRef}
              >
                <ScrollingPage books={userBooks} />
              </div>
              <ExportImage componentRef={componentRef} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
