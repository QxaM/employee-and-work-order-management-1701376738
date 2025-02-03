import { MODAL_TYPE } from '@/components/shared/Modal.tsx';

export interface ModalType {
  index: number;
  message: string;
  hideTimeout?: number;
  type?: keyof typeof MODAL_TYPE;
  onClose: () => void;
}

export interface ModalRefType {
  open: () => void;
}

export interface ModalData {
  id: string;
  content: Omit<ModalType, 'onClose' | 'index'>;
}
