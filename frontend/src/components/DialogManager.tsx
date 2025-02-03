import Modal from './shared/Modal.tsx';
import { removeModal } from '../store/modalSlice.ts';
import { useAppDispatch, useAppSelector } from '../hooks/useStore.tsx';

const DialogManager = () => {
  const dispatch = useAppDispatch();
  const modals = useAppSelector((state) => state.modal.modals);

  const visibleModals = modals.slice(0, 5);

  return (
    <>
      {visibleModals.map((modal, index) => (
        <Modal
          key={modal.id}
          index={index}
          message={modal.content.message}
          hideTimeout={modal.content.hideTimeout}
          type={modal.content.type}
          onClose={() => dispatch(removeModal(modal.id))}
        />
      ))}
    </>
  );
};

export default DialogManager;
