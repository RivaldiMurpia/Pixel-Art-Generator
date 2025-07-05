
import React from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="bg-red-900/50 border-2 border-red-700 text-red-300 p-4 my-8 text-center">
      <p className="font-bold text-sm uppercase mb-1">Error</p>
      <p className="text-xs">{message}</p>
    </div>
  );
};

export default ErrorMessage;
