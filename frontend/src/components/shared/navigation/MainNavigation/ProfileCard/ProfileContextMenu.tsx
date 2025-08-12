import {
  FloatingArrow,
  FloatingContext,
  FloatingFocusManager,
} from '@floating-ui/react';
import { CSSProperties, Ref } from 'react';

interface ProfileContextMenuProps {
  ref: Ref<HTMLDivElement>;
  styles: CSSProperties;
  context: FloatingContext;
  arrow: {
    ref: Ref<SVGSVGElement>;
    width: number;
    height: number;
  };
  otherFloatingProps?: Record<string, unknown>;
}

const ProfileContextMenu = ({
  ref,
  styles,
  context,
  arrow: { ref: arrowRef, width, height },
  otherFloatingProps,
}: ProfileContextMenuProps) => {
  return (
    <FloatingFocusManager context={context} modal={true}>
      <div ref={ref} style={styles} {...otherFloatingProps}>
        <FloatingArrow
          context={context}
          ref={arrowRef}
          width={width}
          height={height}
          tipRadius={2}
          className="fill-qxam-primary-lightest"
        />
        <nav className="min-w-50 min-h-20 bg-qxam-primary-lightest z-10 shadow-lg"></nav>
      </div>
    </FloatingFocusManager>
  );
};

export default ProfileContextMenu;
