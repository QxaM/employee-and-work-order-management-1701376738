import { Form } from 'radix-ui';
import { Button, Flex, Text, TextField } from '@radix-ui/themes';
import clsx from 'clsx/lite';
import FormInputMessage from './FormInputMessage.tsx';
import {
  createInvalidMessage,
  createTooHighMessage,
  createTooLongMessage,
  createTooLowMessage,
  createTooShortMessage,
  createValueMissingMessage,
} from '../../../../utils/validators.ts';
import { ChangeEvent, FormEvent, useState } from 'react';
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { ValidatorType } from '../../../../types/ValidatorTypes.ts';
import { IconType } from '../../../../types/components/BaseTypes.ts';

export interface RadixFormInputProps extends TextField.RootProps {
  icon?: IconType;
  validators?: ValidatorType[];
  onValueChange?: (value: string) => void;
}

const FormInput = (props: RadixFormInputProps) => {
  const EyeClosed = EyeClosedIcon;
  const EyeOpen = EyeOpenIcon;

  const {
    id,
    name,
    type,
    max,
    min,
    maxLength,
    minLength,
    icon: Icon,
    validators = [],
    onInput,
    onChange,
    onValueChange,
    ...rest
  } = props;
  const fieldName = name ?? id ?? 'field';
  const [typeState, setTypeState] = useState(type);

  const EyeIcon = typeState === 'password' ? EyeClosed : EyeOpen;

  const getFieldClasses = (validity: ValidityState | undefined) =>
    clsx(
      validity &&
        !validity.valid &&
        clsx(
          '!shadow-[inset_0_0_0_var(--text-field-border-width)_var(--red-a7)]',
          '!outline-(--red-8) !bg-(--red-a1)'
        )
    );

  const togglePassword = () => {
    if (type === 'password') {
      setTypeState((prevType) =>
        prevType === 'password' ? 'text' : 'password'
      );
    }
  };

  return (
    <Form.Field name={fieldName} className="group w-full">
      <Flex direction="column" gap="1">
        {name && (
          <Form.Label>
            <Text as="p" size="2" className="first-letter:uppercase">
              {name}
            </Text>
          </Form.Label>
        )}
        <Form.ValidityState name={fieldName}>
          {(validity) => {
            return (
              <Form.Control asChild>
                <TextField.Root
                  onInput={(event: FormEvent<HTMLInputElement>) => {
                    onInput?.(event);
                    onValueChange?.(event.currentTarget.value);
                  }}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    onChange?.(event);
                    onValueChange?.(event.currentTarget.value);
                  }}
                  type={typeState}
                  name={fieldName}
                  max={max}
                  min={min}
                  maxLength={maxLength}
                  minLength={minLength}
                  {...rest}
                  size="3"
                  mb="1"
                  className={getFieldClasses(validity)}
                >
                  {Icon && (
                    <TextField.Slot>
                      <Icon
                        strokeWidth={0.75}
                        stroke="currentColor"
                        className="size-(--font-size-5) text-(--gray-a8)"
                      />
                    </TextField.Slot>
                  )}
                  {type === 'password' && (
                    <TextField.Slot side="right">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={togglePassword}
                      >
                        <EyeIcon strokeWidth={0.5} stroke="currentColor" />
                      </Button>
                    </TextField.Slot>
                  )}
                </TextField.Root>
              </Form.Control>
            );
          }}
        </Form.ValidityState>
        <FormInputMessage
          title={createValueMissingMessage(fieldName)}
          match="valueMissing"
        />
        <FormInputMessage
          title={createInvalidMessage(fieldName)}
          match="typeMismatch"
        />
        <FormInputMessage
          title={createInvalidMessage(fieldName)}
          match="badInput"
        />
        <FormInputMessage
          title={createInvalidMessage(fieldName)}
          match="patternMismatch"
        />
        <FormInputMessage
          title={createTooHighMessage(fieldName, max)}
          match="rangeOverflow"
        />
        <FormInputMessage
          title={createTooLowMessage(fieldName, min)}
          match="rangeUnderflow"
        />
        <FormInputMessage
          title={createInvalidMessage(fieldName)}
          match="stepMismatch"
        />
        <FormInputMessage
          title={createTooLongMessage(fieldName, maxLength)}
          match="tooLong"
        />
        <FormInputMessage
          title={createTooShortMessage(fieldName, minLength)}
          match="tooShort"
        />
        {validators.map((validator, index) => (
          <FormInputMessage
            key={`${validator.message}-${index}`}
            title={validator.message}
            match={(value) => validator.validation(value)}
          />
        ))}
      </Flex>
    </Form.Field>
  );
};

export default FormInput;
