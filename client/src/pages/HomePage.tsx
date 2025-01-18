import React from 'react';
import FileUpload from '../components/FileUpload';
import ScreenshotList from '../components/ScreenshotList';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="w-full max-w-2xl mx-auto mt-12">
          <FileUpload />
        </div>
        <div className="w-full bg-white rounded-2xl mt-16">
          <ScreenshotList />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
