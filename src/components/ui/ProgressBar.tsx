import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'purple';
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showValue = true,
  size = 'md',
  color = 'blue',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const sizeStyles = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-4',
  };
  
  const colorStyles = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
  };
  
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
          {showValue && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full ${sizeStyles[size]} bg-gray-200 dark:bg-gray-700 rounded-full`}>
        <div 
          className={`${sizeStyles[size]} ${colorStyles[color]} rounded-full transition-all duration-300 ease-in-out`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;