import { Avatar, Flex, Text } from '@radix-ui/themes';
import IconWithBackground from '../icons/base/IconWithBackground.tsx';
import { UploadIcon } from '@radix-ui/react-icons';
import clsx from 'clsx/lite';
import { useImageUpload } from '../../hooks/useImageUpload.tsx';
import ErrorComponent from '../shared/ErrorComponent.tsx';
import { formatFileSize } from '../../utils/file.ts';

interface ProfileAvatarProps {
  firstName: string | undefined;
  lastName: string | undefined;
  imageUpload: ReturnType<typeof useImageUpload>;
  isEdited?: boolean;
}

const ProfileAvatar = ({
  firstName,
  lastName,
  imageUpload,
  isEdited,
}: ProfileAvatarProps) => {
  const {
    selectedFile,
    dragActive,
    isValidationError,
    validationErrors,
    handleDrag,
    handleDrop,
    handleChange,
  } = imageUpload;

  const firstNameFirstLetter = firstName?.charAt(0) ?? 'M';
  const lastNameFirstLetter = lastName?.charAt(0) ?? 'Q';
  const imageFallback = (
    firstNameFirstLetter + lastNameFirstLetter
  ).toUpperCase();

  const wrapperClasses = clsx(
    'relative border-2 border-dashed rounded-(--radius-2) size-[250px] hover:bg-(--gray-a1)',
    dragActive ? 'border-(--accent-a9)' : 'border-(--gray-a8)'
  );

  const iconClasses = clsx(
    'size-(--space-7) rounded-full',
    dragActive
      ? 'bg-(--accent-a3) text-(--accent-a11)'
      : 'bg-(--gray-a3) text-(--gray-a11)'
  );

  const textClasses = clsx(
    dragActive ? 'text-(--accent-a6)' : 'text-(--gray-a6'
  );

  return (
    <div data-testid="avatar-container">
      {!isEdited && <Avatar size="9" radius="full" fallback={imageFallback} />}
      {isEdited && (
        <Flex direction="column" justify="center" align="center" gap="2">
          <Flex
            justify="center"
            align="center"
            p="2"
            className={wrapperClasses}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={(event) => {
              void handleDrop(event);
            }}
          >
            <label
              htmlFor="avatar-upload"
              aria-label="upload avatar"
              className="absolute w-full h-full inset-0 opacity-0 !cursor-pointer bg-(--red-9)"
            >
              <input
                id="avatar-upload"
                type="file"
                accept=".png, .jpeg, .jpg"
                hidden
                onChange={(event) => {
                  void handleChange(event);
                }}
                draggable
              />
            </label>
            <Flex direction="column" justify="center" align="center" gap="2">
              <IconWithBackground
                icon={UploadIcon}
                color={dragActive ? 'violet' : 'gray'}
                className={iconClasses}
                iconClassName="size-(--font-size-5) text-(--gray-12)"
              />
              <Flex
                direction="column"
                justify="center"
                align="center"
                className={textClasses}
              >
                <Text align="center" weight="medium">
                  Click
                </Text>
                <Text align="center" weight="light">
                  or
                </Text>
                <Text align="center" weight="medium">
                  drag image here
                </Text>

                <Text align="center" weight="regular" size="2" mt="5">
                  File name could only contain letters and number.
                </Text>
              </Flex>
            </Flex>
          </Flex>
          {selectedFile && (
            <Flex direction="column" justify="center" align="center">
              <img
                src={selectedFile.preview}
                alt={selectedFile.name}
                height={150}
                width={150}
                onError={(event) =>
                  (event.currentTarget.style.display = 'none')
                }
              />
              <Flex direction="row" justify="center" align="center" gap="1">
                <Text>{selectedFile.name}</Text>
                <Text>{formatFileSize(selectedFile.size)}</Text>
              </Flex>
            </Flex>
          )}
          {isValidationError &&
            validationErrors.map((error) => (
              <ErrorComponent key={error} error={error} />
            ))}
        </Flex>
      )}
    </div>
  );
};

export default ProfileAvatar;
