import { Flex } from '@radix-ui/themes';
import { Form as RadixForm } from 'radix-ui';
import { FormEvent, PropsWithChildren } from 'react';
import FormHeader from './sub/FormHeader.tsx';
import FormContent from './sub/FormContent.tsx';
import FormInput from './sub/FormInput.tsx';
import FormSubmit from './sub/FormSubmit.tsx';
import FormFooter from './sub/FormFooter.tsx';

interface FormProps {
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  className?: string;
}

const Form = (props: PropsWithChildren<FormProps>) => {
  const { handleSubmit, className, children } = props;

  return (
    <RadixForm.Root onSubmit={handleSubmit} className={className}>
      <Flex
        direction="column"
        justify="center"
        align="center"
        width="100%"
        p="5"
      >
        {children}
      </Flex>
    </RadixForm.Root>
  );
};

Form.Header = FormHeader;
Form.Content = FormContent;
Form.Input = FormInput;
Form.Submit = FormSubmit;
Form.Footer = FormFooter;

export default Form;
