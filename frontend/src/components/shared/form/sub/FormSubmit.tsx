import { Button, Flex } from '@radix-ui/themes';
import { Form as RadixForm } from 'radix-ui';
import LoadingSpinner from '../../LoadingSpinner.tsx';
import { MarginProps } from '@radix-ui/themes/props';
import { IconType } from '../../../../types/ComponentTypes.ts';

interface FormSubmitProps extends MarginProps {
  title: string;
  isServerPending?: boolean;
  icon?: IconType;
}

const FormSubmit = ({
  isServerPending,
  title,
  icon: Icon,
  ...props
}: FormSubmitProps) => {
  const { ...marginProps } = props;

  return (
    <Flex justify="center" align="center" width="100%" my="3" {...marginProps}>
      <LoadingSpinner size="small" isLoading={isServerPending}>
        <RadixForm.Submit asChild>
          <Button size="4" className="!w-full">
            {title}
            {Icon && (
              <Icon
                strokeWidth={1}
                stroke="currentColor"
                className="size-(--font-size-5)"
              />
            )}
          </Button>
        </RadixForm.Submit>
      </LoadingSpinner>
    </Flex>
  );
};

export default FormSubmit;
