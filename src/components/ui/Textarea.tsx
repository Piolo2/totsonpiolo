'use client';

import React from 'react';

interface TextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
  rows?: number;
  name?: string;
}

export default function Textarea({
  value,
  onChange,
  placeholder,
  maxLength,
  className = '',
  rows = 4,
  name,
}: TextareaProps) {
  const isNearLimit = maxLength ? value.length > maxLength * 0.9 : false;

  return (
    <div className="w-full">
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={rows}
        name={name}
        className={`
          rounded-none border border-[#E6E6EF] bg-white
          focus:outline-none focus:ring-2 focus:ring-[#17171C]/20 focus:border-[#17171C]
          p-4 w-full resize-none
          text-[#17171C] placeholder:text-[#9293A5]
          font-['Inter',sans-serif]
          transition-colors
          ${className}
        `}
      />
      {maxLength && (
        <div
          className={`text-sm text-right mt-1 ${
            isNearLimit ? 'text-red-500' : 'text-[#9293A5]'
          }`}
        >
          {value.length}/{maxLength}
        </div>
      )}
    </div>
  );
}

