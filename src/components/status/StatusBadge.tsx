import React from 'react';
import { ItemStatus } from '../../types';
import { STATUS_INFO } from '../../constants';

interface StatusBadgeProps {
  status: ItemStatus;
  size?: 'sm' | 'md' | 'lg';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const statusInfo = STATUS_INFO[status];
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };
  
  return (
    <span 
      className={`${statusInfo.color} text-white font-medium rounded-full inline-flex items-center ${sizeClasses[size]}`}
    >
      {statusInfo.label}
    </span>
  );
};

export default StatusBadge;