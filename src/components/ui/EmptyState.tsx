import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

function DefaultChatBubble() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M24 4C12.954 4 4 11.163 4 20c0 5.105 3.15 9.682 8 12.87V40l6.632-3.648C20.06 36.77 21.998 37 24 37c11.046 0 20-7.163 20-17S35.046 4 24 4z"
        fill="#E6E6EF"
      />
      <circle cx="16" cy="20" r="2" fill="#9293A5" />
      <circle cx="24" cy="20" r="2" fill="#9293A5" />
      <circle cx="32" cy="20" r="2" fill="#9293A5" />
    </svg>
  );
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="text-[#9293A5] mb-4">
        {icon || <DefaultChatBubble />}
      </div>
      <h3 className="text-xl font-bold text-[#17171C] font-['Nunito',sans-serif] mb-2">
        {title}
      </h3>
      <p className="text-[#666779] text-sm mb-6 max-w-sm">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}

