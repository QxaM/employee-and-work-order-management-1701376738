import {
  FormEvent,
  forwardRef,
  HTMLInputTypeAttribute,
  useImperativeHandle,
  useState,
} from 'react';

import { ValidatorType } from '../../types/ValidatorTypes.ts';

interface InputType {
  title: string;
  placeholder: string;
  type?: HTMLInputTypeAttribute;
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
    <div className="flex flex-col gap-1 mx-4 my-2">
      <label
        htmlFor={title}
        className="text-qxam-primary-extreme-dark font-medium ml-2 capitalize"
      >
        {title}
      </label>
      <input
        id={title}
        name={title}
        placeholder={placeholder}
        value={value}
        type={type}
        onChange={handleChange}
        onInput={handleChange}
        className="py-1 px-2 border border-qxam-accent rounded bg-qxam-accent-extreme-light focus:outline-none focus:ring-0 focus:border-qxam-accent-darker focus:border-[3px]"
      ></input>
      {Object.entries(localError).length > 0 && !localError.isValid && (
        <p className="px-2 py-1 flex items-center gap-1 bg-qxam-error-extreme-light text-qxam-error-darker rounded border border-qxam-error-lightest">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-5"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
              clipRule="evenodd"
            />
          </svg>

          {localError.message || 'Input validation error'}
        </p>
      )}
    </div>
  );
});

export default Input;
