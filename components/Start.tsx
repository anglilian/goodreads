import React from "react";

interface StartProps {
  year: number;
}

const Start: React.FC<StartProps> = ({ year }) => {
  return (
    <div className="space-y-4">
      <h1>{year} Goodreads Wrapped</h1>
    </div>
  );
};

export default Start;
