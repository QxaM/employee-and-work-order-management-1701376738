import ModalMessage from './shared/modal/ModalMessage.tsx';
import { removeModal } from '../store/modalSlice.ts';
import { useAppDispatch, useAppSelector } from '../hooks/useStore.tsx';

/**
 * Manages the rendering of multiple modals in the application.
 *
 * The `DialogManager` component is responsible for managing and displaying a list of modals.
 * It retrieves the modal list from the Redux store, limits the number of visible modals to 5,
 * and maps them into `ModalMessage` components.
 *
 * @example
 * // Ensure your Redux store contains modal-related logic like an array of modals.
 * // Add the DialogManager component somewhere in your app:
 *
 * <Provider store={store}>
 *   <DialogManager />
 * </Provider>
 *
 * // Dispatch a modal to the Redux store from anywhere in your app:
 * dispatch(
 *   addModal({
 *     id: 'modal-1',
 *     content: {
 *       message: 'This is a sample modal message.',
 *       type: 'info',
 *       hideTimeout: 5000,
 *     },
 *   })
 * );
 */
const DialogManager = () => {
  const dispatch = useAppDispatch();
  const modals = useAppSelector((state) => state.modal.modals);

  const visibleModals = modals.slice(0, 5);

  return (
    <>
      {visibleModals.map((modal, index) => (
        <ModalMessage
          key={modal.id}
          index={index}
          message={modal.content.message}
          hideTimeout={modal.content.hideTimeout}
          type={modal.content.type}
          sensitivity={modal.content.sensitivity}
          onClose={() => dispatch(removeModal(modal.id))}
        />
      ))}
    </>
  );
};

export default DialogManager;
