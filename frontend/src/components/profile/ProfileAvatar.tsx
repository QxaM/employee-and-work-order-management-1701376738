import { Avatar, Flex, Text } from '@radix-ui/themes';
import IconWithBackground from '../icons/base/IconWithBackground.tsx';
import { UploadIcon } from '@radix-ui/react-icons';
import { ChangeEvent, DragEvent, useEffect, useState } from 'react';
import clsx from 'clsx/lite';

interface UploadType {
  file: File;
  preview: string;
  name: string;
  size: number;
}

interface ProfileAvatarProps {
  firstName: string | undefined;
  lastName: string | undefined;
  isEdited?: boolean;
}

const ProfileAvatar = ({
  firstName,
  lastName,
  isEdited,
}: ProfileAvatarProps) => {
  const [selectedFile, setSelectedFile] = useState<UploadType | undefined>(
    undefined
  );
  const [dragActive, setDragActive] = useState(false);

  const firstNameFirstLetter = firstName?.charAt(0) ?? 'M';
  const lastNameFirstLetter = lastName?.charAt(0) ?? 'Q';
  const imageFallback = (
    firstNameFirstLetter + lastNameFirstLetter
  ).toUpperCase();

  const wrapperClasses = clsx(
    'relative border-2 border-dashed rounded-(--radius-2) size-[160px] hover:bg-(--gray-a1)',
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

  const handleFile = (file: File) => {
    const selectedFile: UploadType = {
      file: file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    };

    setSelectedFile(selectedFile);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (event.currentTarget.files?.[0]) {
      handleFile(event.currentTarget.files[0]);
    }
  };

  const handleDrag = (event: DragEvent<HTMLInputElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.type === 'dragenter' || event.type === 'dragover') {
      setDragActive(true);
    }
    if (event.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (event: DragEvent<HTMLInputElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);

    if (event.dataTransfer.files.length > 0) {
      handleFile(event.dataTransfer.files[0]);
    }
  };

  useEffect(() => {
    return () => {
      if (selectedFile?.preview) {
        URL.revokeObjectURL(selectedFile.preview);
      }
    };
  }, [selectedFile?.preview]);

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
            onDrop={handleDrop}
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
                onChange={handleChange}
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
                <Text>{selectedFile.size}</Text>
              </Flex>
            </Flex>
          )}
        </Flex>
      )}
    </div>
  );
};

export default ProfileAvatar;
