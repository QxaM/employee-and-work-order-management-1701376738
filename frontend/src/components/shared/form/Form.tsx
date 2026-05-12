import { Flex } from '@radix-ui/themes';
import { Form as RadixForm } from 'radix-ui';
import type { SubmitEvent, PropsWithChildren } from 'react';
import FormHeader from './sub/FormHeader.tsx';
import FormContent from './sub/FormContent.tsx';
import FormInput from './sub/FormInput.tsx';
import FormSubmit from './sub/FormSubmit.tsx';
import FormFooter from './sub/FormFooter.tsx';
import type { PaddingProps } from '@radix-ui/themes/props';
import FormSelect from './sub/FormSelect.tsx';

interface FormProps extends PaddingProps {
  handleSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
  className?: string;
}

const Form = (props: PropsWithChildren<FormProps>) => {
  const { handleSubmit, className, children, ...paddingProps } = props;

  return (
    <RadixForm.Root onSubmit={handleSubmit} className={className}>
      <Flex
        direction="column"
        justify="center"
        align="center"
        width="100%"
        p="5"
        {...paddingProps}
      >
        {children}
      </Flex>
    </RadixForm.Root>
  );
};

Form.Header = FormHeader;
Form.Content = FormContent;
Form.Input = FormInput;
Form.Select = FormSelect;
Form.Submit = FormSubmit;
Form.Footer = FormFooter;

export default Form;
