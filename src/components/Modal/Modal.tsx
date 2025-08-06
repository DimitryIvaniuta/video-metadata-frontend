import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import './Modal.scss';

export interface ModalProps {
  isOpen: boolean;
  title: React.ReactNode;
  onClose: () => void;
  maxWidthClass?: string; // e.g. 'max-w-lg', 'max-w-3xl'
  className?: string;
  children?: React.ReactNode;
}

export const Modal = ({
  isOpen,
  title,
  onClose,
  maxWidthClass = "max-w-lg",
  className = "",
  children,
}: ModalProps) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Lock/unlock body scroll while modal is open
  useEffect(() => {
    if (!isOpen) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const overlayClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const content = (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={overlayClick}
    >
      <div
        ref={panelRef}
        className={`modal-panel ${maxWidthClass} ${className}`}
      >
        {/* Header */}
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">
            {title}
          </h2>
          <button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            className="modal-close-btn hover:text-gray-600"
          >
            ×
          </button>
        </div>
        {/* Body */}
        <div className="modal-body">{children}</div>
        {/* Footer */}
        <div className="modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="btn-close hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  // Use a portal so the modal sits at the top of the DOM tree
  return createPortal(content, document.body);
};
