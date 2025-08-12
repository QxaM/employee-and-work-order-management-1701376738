import { Flex, IconButton, Section } from '@radix-ui/themes';
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';

interface RoleControlProps {
  onAddRole: () => void;
  onRemoveRole: () => void;
}

/**
 * RoleControl is a React functional component that renders controls
 * for adding and removing roles. It consists of two buttons that trigger
 * corresponding action handlers when clicked.
 *
 * @param {Object} props - The props object.
 * @param {Function} props.onAddRole - Callback function invoked when the add role button is clicked.
 * @param {Function} props.onRemoveRole - Callback function invoked when the remove role button is clicked.
 */
const RoleControl = ({ onAddRole, onRemoveRole }: RoleControlProps) => {
  return (
    <Section aria-label="role control buttons" p="0">
      <Flex
        direction="column"
        justify="center"
        align="center"
        gap="1"
        my="0"
        height="100%"
      >
        <IconButton
          type="button"
          size="3"
          variant="outline"
          aria-label="add role"
          onClick={onAddRole}
        >
          <DoubleArrowLeftIcon width={24} height={24} />
        </IconButton>
        <span aria-hidden>-</span>
        <IconButton
          type="button"
          size="3"
          variant="outline"
          aria-label="remove role"
          onClick={onRemoveRole}
        >
          <DoubleArrowRightIcon width={24} height={24} />
        </IconButton>
      </Flex>
    </Section>
  );
};

export default RoleControl;
