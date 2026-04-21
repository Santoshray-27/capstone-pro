import React from 'react';

const LoadingSpinner = ({ fullscreen, size = 'md', text = 'Loading...' }) => {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
    xl: 'w-16 h-16 border-4'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizes[size]} border-blue-600 border-t-transparent rounded-full animate-spin`} />
      {text && <p className="text-gray-500 text-sm font-medium animate-pulse">{text}</p>}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white text-xl">🧠</span>
          </div>
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Loading Smart Resume Analyzer...</p>
        </div>
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
