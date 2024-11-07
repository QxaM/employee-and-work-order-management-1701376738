import { FormEvent, useRef } from 'react';

import {
  isValidConfirmPassword,
  isValidEmail,
  isValidPassword,
} from '../utils/Validators.ts';
import Input from './shared/Input.tsx';

const RegisterForm = () => {
  const passwordRef = useRef<string>('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fd = new FormData(event.currentTarget);
    const data = Object.fromEntries(fd.entries());

    if (
      !isValidEmail(data.email as string).isValid ||
      !isValidPassword(data.password as string).isValid ||
      !isValidConfirmPassword(
        data.password as string,
        data['confirm password'] as string
      ).isValid
    ) {
      if (formRef.current?.elements) {
        Array.from(formRef.current.elements).forEach((element) => {
          console.log('Event!');
          const blurEvent = new Event('input', {
            bubbles: true,
            cancelable: true,
          });
          element.dispatchEvent(blurEvent);
        });
      }
      return;
    }

    delete data['confirm password'];
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col" ref={formRef}>
      <h2 className="text-lg text-qxam-primary-extreme-dark font-semibold mx-4 mt-1 mb-2">
        Enter register details
      </h2>
      <Input
        title="email"
        placeholder="example@example.com"
        type="email"
        validator={isValidEmail}
      />
      <Input
        title="password"
        placeholder="Enter password"
        type="password"
        validator={isValidPassword}
        ref={passwordRef}
      />
      <Input
        title="confirm password"
        placeholder="Confirm password"
        type="password"
        validator={(value) =>
          isValidConfirmPassword(passwordRef.current, value)
        }
      />
      <div className="flex justify-end mx-4 mt-2">
        <button type="submit" className="btn-primary px-3 py-1.5 rounded">
          Sign up
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
