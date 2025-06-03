// components/molecules/EmptyState.tsx
'use client';
import React from 'react';
import Button from '../atoms/Button';
import './EmptyState.css';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  variant?: 'default' | 'search' | 'error' | 'loading';
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon,
  variant = 'default'
}) => {
  const getDefaultIcon = () => {
    switch (variant) {
      case 'search':
        return (
          <div className="empty-icon search">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="empty-icon error">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
              <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
        );
      case 'loading':
        return (
          <div className="empty-icon loading">
            <div className="spinner"></div>
          </div>
        );
      default:
        return (
          <div className="empty-icon default">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" stroke="currentColor" strokeWidth="2" fill="none"></rect>
              <line x1="12" y1="11" x2="12" y2="17" stroke="currentColor" strokeWidth="2"></line>
              <line x1="12" y1="11" x2="12" y2="11" stroke="currentColor" strokeWidth="2"></line>
            </svg>
          </div>
        );
    }
  };

  return (
    <div className={`empty-state ${variant}`}>
      <div className="empty-state-content">
        {icon || getDefaultIcon()}
        
        <div className="empty-state-text">
          <h3 className="empty-state-title">{title}</h3>
          {description && (
            <p className="empty-state-description">{description}</p>
          )}
        </div>

        {actionText && onAction && (
          <div className="empty-state-actions">
            <Button
              variant="primary"
              size="medium"
              onClick={onAction}
            >
              {actionText}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyState;