import React from 'react';

interface StatusBadgeProps {
  status: 'unread' | 'read' | 'replied' | 'published' | 'archived';
}

function BlueDot() {
  return <span className="w-2 h-2 rounded-full bg-[#4778F5] inline-block" />;
}

function CheckIcon({ color }: { color: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.5 6.5L5 9L10 3.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 1.5L7.3 4.2L10.3 4.6L8.15 6.7L8.6 9.7L6 8.3L3.4 9.7L3.85 6.7L1.7 4.6L4.7 4.2L6 1.5Z"
        fill="#B8860B"
        stroke="#B8860B"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArchiveIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1.5" width="10" height="3" rx="1" stroke="#9293A5" strokeWidth="1.2" />
      <path d="M2 4.5V10C2 10.5523 2.44772 11 3 11H9C9.55228 11 10 10.5523 10 10V4.5" stroke="#9293A5" strokeWidth="1.2" />
      <path d="M4.5 7H7.5" stroke="#9293A5" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

const statusConfig: Record<
  StatusBadgeProps['status'],
  { icon: React.ReactNode; label: string; textColor: string }
> = {
  unread: {
    icon: <BlueDot />,
    label: 'New',
    textColor: 'text-[#4778F5]',
  },
  read: {
    icon: <CheckIcon color="#9293A5" />,
    label: 'Read',
    textColor: 'text-[#9293A5]',
  },
  replied: {
    icon: <CheckIcon color="#16A34A" />,
    label: 'Replied',
    textColor: 'text-[#16A34A]',
  },
  published: {
    icon: <StarIcon />,
    label: 'Published',
    textColor: 'text-[#B8860B]',
  },
  archived: {
    icon: <ArchiveIcon />,
    label: 'Archived',
    textColor: 'text-[#9293A5]',
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${config.textColor}`}>
      {config.icon}
      {config.label}
    </span>
  );
}

