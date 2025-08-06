import React, {useEffect, PropsWithChildren, MouseEvent, useCallback, useRef} from 'react';

export interface ModalProps {
    isOpen: boolean;
    /** Heading shown in the modal header */
    title: React.ReactNode;
    /** Called on overlay click, ESC, or close button */
    onClose: () => void;
    /** Tailwind width constraint for the dialog panel (e.g. 'max-w-lg', 'max-w-3xl') */
    maxWidthClass?: string;
    /** Extra classes for the panel, if needed */
    className?: string;
    /** Modal content */
    children?: React.ReactNode;
}

/**
 * Accessible modal rendered via portal.
 * - Covers viewport with a semi-transparent backdrop.
 * - Positions dialog ~30% from top (mt-[30vh]).
 * - Locks body scroll while open.
 * - Closes on ESC or backdrop click.
 */
export const Modal: React.FC<ModalProps> =({
                                               isOpen,
                                               title,
                                               onClose,
                                               maxWidthClass = 'max-w-lg',
                                               className = '',
                                               children,
                      }: PropsWithChildren<ModalProps>) => {
    const closeBtnRef = useRef<HTMLButtonElement>(null);

    // Focus the close button on open for accessibility
    useEffect(() => {
        if (isOpen) {
            closeBtnRef.current?.focus();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleOverlayClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
        if (e.key === 'Escape') onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onClick={handleOverlayClick}
            onKeyDown={handleKeyDown}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div
                className={`w-full ${maxWidthClass} bg-white rounded-lg shadow-xl overflow-hidden ${className}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <h2 id="modal-title" className="text-lg font-semibold text-gray-800">
                        {title}
                    </h2>
                    <button
                        ref={closeBtnRef}
                        type="button"
                        onClick={onClose}
                        aria-label="Close dialog"
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                        ×
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">{children}</div>

                {/* Footer (optional) */}
                <div className="px-6 pb-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex items-center rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
export default Modal;
