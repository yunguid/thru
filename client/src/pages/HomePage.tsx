import React from 'react';
import FileUpload from '../components/FileUpload';
import ScreenshotList from '../components/ScreenshotList';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-16">
          <h1 className="text-7xl font-serif text-blue-600">
            UPLOAD
          </h1>
          
          <div className="w-full max-w-2xl mx-auto">
            <FileUpload />
          </div>

          <div className="w-full bg-white rounded-3xl shadow-xl p-10">
            <ScreenshotList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
