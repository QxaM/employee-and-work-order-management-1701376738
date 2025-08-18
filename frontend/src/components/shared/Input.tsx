import { FormEvent, forwardRef, useImperativeHandle, useState } from 'react';

import { ValidatorType } from '../../types/ValidatorTypes.ts';
import { Flex, Text, TextField } from '@radix-ui/themes';
import { Label } from 'radix-ui';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

interface InputType {
  title: string;
  placeholder: string;
  type?: TextField.RootProps['type'];
  validator?: (value: string) => ValidatorType;
}

/**
 * A customizable input component with validation support.
 *
 * @param {InputType} props - The props for the Input component.
 * @param {string} props.title - The input's label and identifier.
 * @param {string} props.placeholder - Placeholder text for the input field.
 * @param {HTMLInputTypeAttribute} [props.type='text'] - Type of the input (e.g., "text", "email", "password").
 * @param {function} [props.validator] - A validation function that checks the input value and returns a validation result (e.g., `{ isValid: boolean, message?: string }`).
 *
 * @example
 * const validator = (value: string) => {
 *   if (value.length < 3) {
 *     return { isValid: false, message: "Input must be at least 3 characters long." };
 *   }
 *   return { isValid: true };
 * };
 *
 * <Input
 *   title="Username"
 *   placeholder="Enter your username"
 *   validator={validator}
 *   ref={inputRef}
 * />
 */
const Input = forwardRef<string, InputType>((props, ref) => {
  Input.displayName = 'Input';

  const { title, placeholder, type = 'text', validator } = props;
  const [value, setValue] = useState('');
  const [localError, setLocalError] = useState({} as ValidatorType);

  useImperativeHandle(ref, () => value, [value]);

  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    const currentValue = event.currentTarget.value;
    setValue(currentValue);

    if (validator) {
      setLocalError(validator(currentValue));
    }
  };

  return (
    <Flex direction="column" gap="1" mx="4" my="2">
      <Label.Root
        htmlFor={title}
        className="text-(--accent-12) font-(--font-weight-medium) ml-(--space-2) capitalize"
      >
        {title}
      </Label.Root>
      <TextField.Root
        id={title}
        name={title}
        placeholder={placeholder}
        value={value}
        type={type}
        onChange={handleChange}
        onInput={handleChange}
      ></TextField.Root>
      {Object.entries(localError).length > 0 && !localError.isValid && (
        <Flex
          px="2"
          py="1"
          gap="2"
          align="center"
          className="bg-(--red-a3) text-(--red-11) border border-(--red-a4) rounded-(--radius-1)"
        >
          <ExclamationTriangleIcon className="size-(--font-size-3)" />
          <Text as="p" size="3">
            {localError.message}
          </Text>
        </Flex>
      )}
    </Flex>
  );
});

export default Input;
