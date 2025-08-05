import React, { useEffect, PropsWithChildren, MouseEvent, useCallback } from 'react';
import { createPortal } from 'react-dom';

export interface ModalProps {
    isOpen: boolean;
    title?: string;
    onClose: () => void;
    /** Max width of the dialog panel (Tailwind width class). Default: max-w-lg */
    maxWidthClass?: string;
}

/**
 * Accessible modal rendered via portal.
 * - Covers viewport with a semi-transparent backdrop.
 * - Positions dialog ~30% from top (mt-[30vh]).
 * - Locks body scroll while open.
 * - Closes on ESC or backdrop click.
 */
export function Modal({
                          isOpen,
                          title,
                          onClose,
                          maxWidthClass = 'max-w-lg',
                          children,
                      }: PropsWithChildren<ModalProps>) {
    // Close on ESC
    const onKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    useEffect(() => {
        if (!isOpen) return;
        document.body.classList.add('modal-open');
        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            document.body.classList.remove('modal-open');
        };
    }, [isOpen, onKeyDown]);

    if (!isOpen) return null;

    const stop = (e: MouseEvent) => e.stopPropagation();

    return createPortal(
        <div
            className="fixed inset-0 z-[1000] bg-black/50"
            role="dialog"
            aria-modal="true"
            onClick={onClose}    // backdrop click closes
        >
            {/* Flex container to center horizontally; push down by 30% of viewport height */}
            <div className="min-h-full flex justify-center items-start">
                <div
                    className={`w-full ${maxWidthClass} mt-[30vh] bg-white rounded-lg shadow-xl`}
                    onClick={stop}   // prevent backdrop click from closing when clicking inside
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b px-6 py-4">
                        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                        <button
                            aria-label="Close modal"
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                            ×
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6">{children}</div>

                    {/* Footer */}
                    <div className="border-t px-6 py-3 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
export default Modal;
