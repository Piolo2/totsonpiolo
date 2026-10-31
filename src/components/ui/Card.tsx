import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'lavender' | 'blue';
}

const variantStyles: Record<string, string> = {
  default: 'bg-white border border-[#E6E6EF] shadow-[0_1px_3px_rgba(0,0,0,0.04)]',
  lavender: 'bg-[#E8E8FA] border-none',
  blue: 'bg-[#E8EEFF] border-none',
};

export default function Card({
  children,
  className = '',
  variant = 'default',
}: CardProps) {
  return (
    <div className={`rounded-[20px] p-5 ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
}

