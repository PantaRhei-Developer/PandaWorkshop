'use client';

import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import type { ToastMessage, ToastType } from '@/types';

interface ToastProps {
  message: ToastMessage;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(message.id), 300);
    }, message.duration || 3000);

    return () => clearTimeout(timer);
  }, [message.id, message.duration, onClose]);

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  return (
    <div
      className={clsx(
        'toast transition-all duration-300',
        message.type,
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      )}
    >
      <div className="flex items-start gap-3">
        <span className="text-lg flex-shrink-0">
          {icons[message.type]}
        </span>
        
        <div className="flex-1">
          <div className="font-semibold text-gray-900">
            {message.title}
          </div>
          {message.message && (
            <div className="text-sm text-gray-600 mt-1">
              {message.message}
            </div>
          )}
        </div>
        
        <button
          onClick={() => onClose(message.id)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

// Toast Container Component
interface ToastContainerProps {
  messages: ToastMessage[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ messages, onClose }) => {
  if (messages.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-50 space-y-4">
      {messages.map((message) => (
        <Toast
          key={message.id}
          message={message}
          onClose={onClose}
        />
      ))}
    </div>
  );
};

export default Toast;
