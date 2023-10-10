import { create } from 'zustand';

interface useAuditModalAudit {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useAuditModal = create<useAuditModalAudit>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
