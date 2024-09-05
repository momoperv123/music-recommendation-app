import React from 'react';

const NotFoundPage = () => {
  return (
    <div className="w-full col-span-full flex justify-center items-center mt-10">
        <h1 className="text-center text-xl font-semibold text-gray-400">404 - Page Not Found</h1>
        <p className="text-center text-md font-semibold text-gray-400">The page you are looking for does not exist.</p>
    </div>
  );
};

export default NotFoundPage;
