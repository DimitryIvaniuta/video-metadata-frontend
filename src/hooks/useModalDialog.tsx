// src/hooks/useModalDialog.ts
import React, { ReactNode, useState, useCallback } from "react";
import { Modal } from "@/components/Modal";

export interface ModalControls {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/** Options for how your modal wrapper should look */
export interface UseModalDialogOptions {
  title: ReactNode;
  /** Tailwind max-width class, e.g. 'max-w-lg' */
  maxWidthClass?: string;
  /** Additional classes for the panel */
  panelClassName?: string;
}

/**
 * A reusable hook for driving any number of modals.
 *
 * @param opts  How the outer Modal should be configured
 * @param renderContent  A callback that receives your controls and returns the modal body
 * @returns controls + a ready‐to‐render `dialog` element
 */
export function useModalDialog(
  opts: UseModalDialogOptions,
  renderContent: (controls: ModalControls) => ReactNode,
): ModalControls & { dialog: ReactNode } {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((x) => !x), []);

  const controls: ModalControls = { isOpen, open, close, toggle };

  const dialog = (
    <Modal
      isOpen={isOpen}
      title={opts.title}
      onClose={close}
      maxWidthClass={opts.maxWidthClass}
      className={opts.panelClassName}
    >
      {renderContent(controls)}
    </Modal>
  );

  return { ...controls, dialog };
}
