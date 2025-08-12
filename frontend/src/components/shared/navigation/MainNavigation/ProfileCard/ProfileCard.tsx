import { useMeData } from '../../../../../hooks/useMeData.tsx';
import ProfileContextMenu from './ProfileContextMenu.tsx';
import {
  arrow,
  autoUpdate,
  offset,
  safePolygon,
  useClick,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
} from '@floating-ui/react';
import { useRef, useState } from 'react';

const ProfileCard = () => {
  const cardClasses =
    'mr-2 min-h-11 aspect-square ' +
    'cursor-pointer rounded ' +
    'bg-qxam-primary-lightest text-qxam-primary-darker font-black' +
    'text-center text-2xl uppercase ' +
    'shadow shadow-qxam-primary-lightest/50 ' +
    'flex justify-center items-center ' +
    'hover:shadow-md hover:shadow-qxam-primary-lightest/75 ' +
    'hover:border-2 hover:border-qxam-primary';
  const arrowWidth = 15;
  const arrowHeight = 10;
  const gap = 2;

  const arrowRef = useRef<SVGSVGElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const { me } = useMeData();
  const { refs, floatingStyles, context } = useFloating({
    placement: 'bottom-end',
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(arrowHeight + gap),
      arrow({
        element: arrowRef,
      }),
    ],
  });

  const hover = useHover(context, {
    move: false,
    handleClose: safePolygon({
      buffer: 1,
      blockPointerEvents: true,
    }),
  });
  const focus = useFocus(context);
  const click = useClick(context);
  const dismiss = useDismiss(context, {});
  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    click,
    dismiss,
  ]);

  const firstLetter = me?.email.charAt(0);

  return (
    <div className="flex">
      <button
        ref={refs.setReference}
        className={cardClasses}
        data-testid="profile-card"
        aria-label="profile"
        {...getReferenceProps()}
      >
        {firstLetter && <span aria-hidden="true">{firstLetter}</span>}
      </button>
      {isOpen && (
        <ProfileContextMenu
          ref={refs.setFloating}
          styles={floatingStyles}
          context={context}
          arrow={{
            ref: arrowRef,
            width: arrowWidth,
            height: arrowHeight,
          }}
          {...getFloatingProps()}
        />
      )}
    </div>
  );
};

export default ProfileCard;
