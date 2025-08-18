import { CheckCircledIcon, ExclamationTriangleIcon, InfoCircledIcon, } from '@radix-ui/react-icons';
import { Toast } from 'radix-ui';
import { NonUndefined } from './SharedTypes.ts';

/**
 * Defines the structure of a modal object.
 */
export interface ModalType {
  index: number;
  message: string;
  hideTimeout?: number;
  type?: keyof typeof MODAL_TYPE;
  sensitivity?: ModalSensitivity;
  onClose: () => void;
}

/**
 * Represents modal data stored in the state. This data will be later provided to render a
 * `ModalMessage` component.
 *
 * `onClose` and `index` are Omitted from content, since will be provided by `DialogManager`
 */
export interface ModalData {
  id: string;
  content: Omit<ModalType, 'onClose' | 'index'>;
}

/**
 * Predefined modal types with corresponding styling and icons.
 */
export const MODAL_TYPE = {
  info: {
    background: 'bg-(--yellow-2)',
    text: 'text-(--yellow-12)',
    border: 'border-(--yellow-3)',
    icon: <InfoCircledIcon className="size-(--font-size-5)" />,
  },
  success: {
    background: 'bg-(--grass-3)',
    text: 'text-(--grass-12)',
    border: 'border-(--grass-4)',
    icon: <CheckCircledIcon className="size-(--font-size-5)" />,
  },
  error: {
    background: 'bg-(--red-3)',
    text: 'text-(--red-12)',
    border: 'border-(--red-4)',
    icon: <ExclamationTriangleIcon className="size-(--font-size-5)" />,
  },
};

export type ModalSensitivity = NonUndefined<
  Parameters<typeof Toast.Root>[0]['type']
>;
