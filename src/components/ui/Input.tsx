import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  className = '', 
  id,
  ...props 
}) => {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  
  return (
    <div className="space-y-1">
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm
          dark:bg-gray-700 dark:text-white
          placeholder-gray-400 
          focus:outline-none focus:ring-blue-500 focus:border-blue-500 
          ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
          ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;