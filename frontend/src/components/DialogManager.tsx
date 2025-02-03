import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import Modal from '@/components/shared/Modal.tsx';
import { removeModal } from '@/store/modalSlice.ts';

const DialogManager = () => {
  const dispatch: AppDispatch = useDispatch();
  const modals = useSelector((state: RootState) => state.modal.modals);

  const visibleModals = modals.slice(0, 5);

  return (
    <>
      {visibleModals.map((modal) => (
        <Modal
          key={modal.id}
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
