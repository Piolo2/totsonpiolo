'use client';

import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  className?: string;
  icon?: React.ReactNode;
  loading?: boolean;
}

const variantStyles: Record<string, string> = {
  primary: 'bg-[#202127] dark:bg-white hover:bg-[#35363d] dark:hover:bg-[#EAEAF0] text-white dark:text-[#0D0E12]',
  secondary: 'bg-[#E8E8FA] dark:bg-[#272736] hover:bg-[#DDE0FA] dark:hover:bg-[#32324A] text-[#17171C] dark:text-[#EDEDF2]',
  outline: 'border border-[#E6E6EF] dark:border-[#272736] bg-white dark:bg-[#16161D] hover:bg-[#F7F7FC] dark:hover:bg-[#1E1E28] text-[#17171C] dark:text-[#EDEDF2]',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
  ghost: 'bg-transparent hover:bg-[#F7F7FC] dark:hover:bg-[#1E1E28] text-[#666779] dark:text-[#8E8E9F]',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  icon,
  loading = false,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        rounded-[14px] font-medium inline-flex items-center justify-center gap-2
        transition-colors
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {loading ? <Spinner /> : icon}
      {children}
    </button>
  );
}
