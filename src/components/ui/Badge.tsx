import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'blue' | 'yellow' | 'green' | 'red';
  count?: number;
}

const variantStyles: Record<string, string> = {
  default: 'bg-[#E6E6EF] text-[#666779]',
  blue: 'bg-[#E8EEFF] text-[#4778F5]',
  yellow: 'bg-[#FFF3D6] text-[#B8860B]',
  green: 'bg-[#E8FAEF] text-[#16A34A]',
  red: 'bg-[#FFE8E8] text-[#DC2626]',
};

export default function Badge({
  children,
  variant = 'default',
  count,
}: BadgeProps) {
  return (
    <span
      className={`
        rounded-full px-2.5 py-0.5 text-xs font-semibold
        inline-flex items-center gap-1
        ${variantStyles[variant]}
      `}
    >
      {children}
      {count !== undefined && (
        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-current/20 text-[10px]">
          {count}
        </span>
      )}
    </span>
  );
}

