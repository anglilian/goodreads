// components/FileUpload.tsx
import React from "react";

interface FileUploadProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  return (
    <div className="mt-4 space-y-4">
      <p className="mt-2">
        Upload your Goodreads library{" "}
        <a href="https://www.goodreads.com/review/import" target="_blank">
          from here
        </a>{" "}
        to start
      </p>
      <label className="flex items-center justify-center border border-gray-300 rounded p-2 cursor-pointer">
        <span>Choose file</span>
        <input
          type="file"
          accept=".csv"
          onChange={onFileUpload}
          className="hidden"
        />
      </label>
    </div>
  );
};

export default FileUpload;
