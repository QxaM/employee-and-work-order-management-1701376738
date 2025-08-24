import { Flex, Text } from '@radix-ui/themes';
import {
  isValidPassword,
  MINIMUM_PASSWORD_LENGTH,
  missingLowercaseLetter,
  missingNumber,
  missingUppercaseLetter,
} from '../../../utils/Validators.ts';
import { Label } from 'radix-ui';
import clsx from 'clsx';

interface PasswordRequirementsProps {
  password: string;
}

const PasswordRequirements = ({ password }: PasswordRequirementsProps) => {
  const highlightIfValid = (validator: () => boolean) => {
    return clsx(validator() && '!text-(--green-11)');
  };

  return (
    <Flex
      direction="column"
      justify="start"
      align="start"
      width="100%"
      mt="2"
      px="4"
    >
      <Label.Root htmlFor="password-requirements" asChild>
        <Text
          size="2"
          weight="medium"
          className={highlightIfValid(() => isValidPassword(password))}
        >
          Password Requirements
        </Text>
      </Label.Root>
      <ul
        id="password-requirements"
        className="text-(length:--font-size-2) w-full !list-disc px-(--space-5)"
      >
        <li
          className={highlightIfValid(
            () => password.length >= MINIMUM_PASSWORD_LENGTH
          )}
        >
          At least {MINIMUM_PASSWORD_LENGTH} characters
        </li>
        <li
          className={highlightIfValid(() => !missingUppercaseLetter(password))}
        >
          At least 1 uppercase letter
        </li>
        <li
          className={highlightIfValid(() => !missingLowercaseLetter(password))}
        >
          At least 1 lowercase letter
        </li>
        <li className={highlightIfValid(() => !missingNumber(password))}>
          At least 1 number
        </li>
      </ul>
    </Flex>
  );
};

export default PasswordRequirements;
