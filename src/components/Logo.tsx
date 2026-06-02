import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 32 }) => {
  return (
    <img
      src="./5.png?v=2"
      alt="Kodify Logo"
      className={`${className} object-contain`}
      style={{ width: size, height: size }}
      onError={(e) => {
        // Fallback to absolute path if relative path fails (e.g. on nested sub-pages)
        const target = e.target as HTMLImageElement;
        if (target.src !== window.location.origin + '/5.png?v=2') {
          target.src = '/5.png?v=2';
        }
      }}
    />
  );
};
