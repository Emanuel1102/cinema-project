import React, { useEffect, useRef } from 'react';

interface CancelConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const CancelConfirmModal: React.FC<CancelConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle Escape key to close the modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Handle click outside to close the modal
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby="cancel-modal-title"
      aria-describedby="cancel-modal-description"
    >
      <div
        ref={modalRef}
        className="w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-xl dark:bg-gray-800"
      >
        <div className="flex flex-col items-center text-center">
          {/* Warning Icon */}
          <div className="flex items-center justify-center w-12 h-12 mb-4 text-red-600 bg-red-100 rounded-full dark:bg-red-900/30 dark:text-red-500">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          
          <h2 
            id="cancel-modal-title" 
            className="mb-2 text-xl font-bold text-gray-900 dark:text-white"
          >
            Cancel Reservation
          </h2>
          
          <p 
            id="cancel-modal-description"
            className="mb-6 text-sm text-gray-500 dark:text-gray-400"
          >
            <strong>Warning:</strong> This is an <strong>irreversible action</strong>.
            Canceling your reservation will release your purchased seats, making them available for others to book.
          </p>
          
          <div className="flex w-full gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 dark:focus:ring-offset-gray-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 px-4 py-2 text-sm font-medium text-white transition-colors bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
