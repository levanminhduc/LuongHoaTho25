import React from 'react';

const TestPage: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900">Test Page</h1>
      <p className="text-gray-600">This is a simple test page to check if React is working.</p>
      <div className="mt-4 p-4 bg-blue-100 rounded-lg">
        <p className="text-blue-800">If you can see this, React is working!</p>
      </div>
    </div>
  );
};

export default TestPage;
