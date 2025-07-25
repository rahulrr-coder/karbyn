import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

/**
 * Toast notification component
 * @param {Object} props - Component props
 * @param {string} props.type - Toast type (success, error, info, warning)
 * @param {string} props.message - Toast message
 * @param {number} props.duration - Duration in milliseconds before auto-dismiss
 * @param {boolean} props.visible - Whether the toast is visible
 * @param {Function} props.onClose - Function to call when toast is closed
 */
const Toast = ({ type = 'info', message, duration = 5000, visible = true, onClose }) => {
  const [isVisible, setIsVisible] = useState(visible);
  
  useEffect(() => {
    setIsVisible(visible);
    
    if (visible && duration) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);
  
  if (!isVisible) return null;
  
  const typeConfig = {
    success: {
      icon: 'CheckCircle',
      bgColor: 'bg-success/10',
      borderColor: 'border-success',
      textColor: 'text-success',
    },
    error: {
      icon: 'AlertCircle',
      bgColor: 'bg-error/10',
      borderColor: 'border-error',
      textColor: 'text-error',
    },
    warning: {
      icon: 'AlertTriangle',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning',
      textColor: 'text-warning',
    },
    info: {
      icon: 'Info',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary',
      textColor: 'text-primary',
    },
  };
  
  const config = typeConfig[type] || typeConfig.info;
  
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className={`flex items-center space-x-3 p-4 rounded-lg border ${config.bgColor} ${config.borderColor} shadow-lg max-w-md`}>
        <Icon name={config.icon} size={20} className={config.textColor} />
        <div className="flex-1">
          <p className="text-sm text-foreground">{message}</p>
        </div>
        <button 
          onClick={handleClose}
          className="text-muted-foreground hover:text-foreground"
        >
          <Icon name="X" size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
