import { fireEvent, render, screen } from '@testing-library/react';
import RegisterForm from '@/components/RegisterForm.tsx';
import { afterEach, beforeEach, describe } from 'vitest';
import { useRef } from 'react';

vi.mock('react', async () => {
  const react = await vi.importActual('react');
  return {
    ...react,
    useRef: vi.fn((initialValue: string) => ({
      current: initialValue,
    })),
  };
});

const EMAIL_TITLE = 'email';
const PASSWORD_TITLE = 'password';
const CONFIRM_PASSWORD_TITLE = 'confirm password';
const REGISTER_BUTTON_TEXT = 'Sign up';

describe('Register Form', () => {
  beforeEach(() => {
    vi.resetModules();

    let refValue = '';
    vi.mocked(useRef).mockImplementation(() => ({
      get current() {
        return refValue;
      },
      set current(value) {
        refValue = value;
      },
    }));
  });

  afterEach(() => {
    vi.mocked(useRef).mockReset();
    vi.restoreAllMocks();
  });

  it('Should contain necessary elements - title, inputs, button', () => {
    // Given
    const headerTitle = 'Enter register details';

    // When
    render(<RegisterForm />);
    const headerElement = screen.getByText(headerTitle);
    const emailElement = screen.getByLabelText(EMAIL_TITLE);
    const passwordElement = screen.getByLabelText(PASSWORD_TITLE);
    const confirmPasswordElement = screen.getByLabelText(
      CONFIRM_PASSWORD_TITLE
    );

    // Then
    expect(headerElement).toBeInTheDocument();
    expect(emailElement).toBeInTheDocument();
    expect(passwordElement).toBeInTheDocument();
    expect(confirmPasswordElement).toBeInTheDocument();
  });

  it('Should validate confirm password correctly and throw error when confirm empty', async () => {
    // Given
    render(<RegisterForm />);
    const passwordElement = screen.getByLabelText(PASSWORD_TITLE);
    const confirmPasswordElement = screen.getByLabelText(
      CONFIRM_PASSWORD_TITLE
    );

    // When
    fireEvent.change(passwordElement, { target: { value: 'test123' } });
    fireEvent.change(confirmPasswordElement, { target: { value: 't' } });
    fireEvent.change(confirmPasswordElement, { target: { value: '' } });

    // Then
    const errorElement = await screen.findByText('Enter password confirmation');
    expect(errorElement).toBeInTheDocument();
  });

  it('Should validate confirm password correctly and throw error when confirm different', async () => {
    // Given
    render(<RegisterForm />);
    const passwordElement = screen.getByLabelText(PASSWORD_TITLE);
    const confirmPasswordElement = screen.getByLabelText(
      CONFIRM_PASSWORD_TITLE
    );

    // When
    fireEvent.change(passwordElement, { target: { value: 'test123' } });
    fireEvent.change(confirmPasswordElement, {
      target: { value: 'different' },
    });

    // Then
    const errorElement = await screen.findByText('Passwords do not match');
    expect(errorElement).toBeInTheDocument();
  });

  describe('Sing up logic', () => {
    let emailElement: HTMLElement;
    let passwordElement: HTMLElement;
    let confirmPasswordElement: HTMLElement;
    let registerButton: HTMLElement;

    vi.spyOn(console, 'log');

    beforeEach(() => {
      render(<RegisterForm />);
      emailElement = screen.getByLabelText(EMAIL_TITLE);
      passwordElement = screen.getByLabelText(PASSWORD_TITLE);
      confirmPasswordElement = screen.getByLabelText(CONFIRM_PASSWORD_TITLE);
      registerButton = screen.getByRole('button', {
        name: REGISTER_BUTTON_TEXT,
      });

      vi.spyOn(console, 'log');
    });

    it('Should register with correct data', () => {
      // Given

      // When
      fireEvent.change(emailElement, { target: { value: 'test@test.com' } });
      fireEvent.change(passwordElement, { target: { value: 'test123' } });
      fireEvent.change(confirmPasswordElement, {
        target: { value: 'test123' },
      });
      fireEvent.click(registerButton);

      //Then
      expect(console.log).toHaveBeenCalledOnce();
      expect(console.log).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'test123',
      });
    });

    it('Should not register with invalid email', () => {
      // Given

      // When
      fireEvent.change(emailElement, { target: { value: 'test.com' } });
      fireEvent.change(passwordElement, { target: { value: 'test123' } });
      fireEvent.change(confirmPasswordElement, { target: { value: 'test' } });
      fireEvent.click(registerButton);

      //Then
      expect(console.log).not.toHaveBeenCalledOnce();
    });

    it('Should not register with invalid password', () => {
      // Given

      // When
      fireEvent.change(emailElement, { target: { value: 'test@test.com' } });
      fireEvent.change(passwordElement, { target: { value: '' } });
      fireEvent.change(confirmPasswordElement, { target: { value: 'test' } });
      fireEvent.click(registerButton);

      //Then
      expect(console.log).not.toHaveBeenCalledOnce();
    });

    it('Should not register with invalid password confirmation', () => {
      // Given

      // When
      fireEvent.change(emailElement, { target: { value: 'test@test.com' } });
      fireEvent.change(passwordElement, { target: { value: 'test' } });
      fireEvent.change(confirmPasswordElement, { target: { value: '1234' } });
      fireEvent.click(registerButton);

      //Then
      expect(console.log).not.toHaveBeenCalledOnce();
    });
  });
});
