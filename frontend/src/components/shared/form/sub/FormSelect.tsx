import { Form } from 'radix-ui';
import { Flex, Select, Text } from '@radix-ui/themes';
import FormInputMessage from './FormInputMessage.tsx';
import { createValueMissingMessage } from '../../../../utils/validators.ts';
import { useRef, useState } from 'react';
import clsx from 'clsx';

interface SelectOption {
  label: string;
  value: string;
}

interface RadixFormSelectProps {
  options: SelectOption[];
  id?: string;
  name?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
}

const FormSelect = (props: RadixFormSelectProps) => {
  const { options, id, name, required, placeholder, defaultValue } = props;

  const [value, setValue] = useState<string>('');
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);

  const fieldName = name ?? id ?? 'selectField';

  const getFieldClasses = (validity: ValidityState | undefined) =>
    clsx(
      validity &&
      !validity.valid &&
      clsx(
        '!shadow-[inset_0_0_0_1px_var(--red-a7)]',
        '!outline-(--red-8) !bg-(--red-a1)'
      ),
      '!w-full'
    );

  const handleSelectChange = (value: string) => {
    setValue(value);

    const el = hiddenInputRef.current;
    if (el) {
      el.value = value;
      el.dispatchEvent(new Event('change', { bubbles: true }));
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  return (
    <Form.Field name={fieldName} className="group w-full">
      <Flex direction="column" gap="1" mb="1">
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
              <Flex direction="row" justify="center" flexGrow="1" mb="1">
                <Form.Control asChild>
                  <input
                    ref={hiddenInputRef}
                    hidden={true}
                    name={fieldName}
                    defaultValue={defaultValue}
                    required={required}
                    value={value}
                  />
                </Form.Control>
                <Select.Root
                  name={`${fieldName}-select`}
                  defaultValue={defaultValue}
                  required={required}
                  size="3"
                  onValueChange={handleSelectChange}
                >
                  <Select.Trigger
                    placeholder={placeholder ?? 'Select an option'}
                    className={getFieldClasses(validity)}
                  />
                  <Select.Content position="popper">
                    {options.map(({ label, value }) => (
                      <Select.Item key={value} value={value}>
                        {label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Flex>
            );
          }}
        </Form.ValidityState>
        <FormInputMessage
          title={createValueMissingMessage(fieldName)}
          match="valueMissing"
        />
      </Flex>
    </Form.Field>
  );
};

export default FormSelect;
