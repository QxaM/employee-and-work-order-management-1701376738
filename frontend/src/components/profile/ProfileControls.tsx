import { Button, Flex } from '@radix-ui/themes';
import { Cross2Icon, Pencil1Icon } from '@radix-ui/react-icons';
import FormSubmit from '../shared/form/sub/FormSubmit.tsx';
import SaveIcon from '../icons/SaveIcon.tsx';

interface ProfileControlsProps {
  isEdited: boolean;
  onEdit: () => void;
  onCancel: () => void;
}

const ProfileControls = ({
  isEdited,
  onEdit,
  onCancel,
}: ProfileControlsProps) => {
  return (
    <Flex
      gridColumnStart="1"
      gridColumnEnd="3"
      justify="center"
      align="center"
      gap="2"
    >
      {!isEdited && (
        <Button size="4" my="3" onClick={onEdit}>
          <Pencil1Icon className="size-(--font-size-5)" /> Edit profile
        </Button>
      )}
      {isEdited && (
        <>
          <FormSubmit
            title="Save changes"
            color="green"
            width="fit"
            icon={SaveIcon}
          />
          <Button size="4" color="gray" variant="soft" onClick={onCancel}>
            <Cross2Icon className="size-(--font-size-5)" /> Cancel
          </Button>
        </>
      )}
    </Flex>
  );
};

export default ProfileControls;
