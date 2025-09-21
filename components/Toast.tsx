
import React from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
}

export const Toast: React.FC<ToastProps> = ({ message, type }) => {
  const baseClasses = 'p-4 rounded-md shadow-lg text-white flex items-center animate-fade-in-down';
  const typeClasses = {
    success: 'bg-green-500',
    error: 'bg-red-500',
  };

  const Icon: React.FC = () => {
    if (type === 'success') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };
  
  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      <Icon />
      <span>{message}</span>
    </div>
  );
};
