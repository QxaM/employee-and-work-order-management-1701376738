import { Button, ButtonProps, Flex } from '@radix-ui/themes';
import { Form as RadixForm } from 'radix-ui';
import LoadingSpinner from '../../LoadingSpinner.tsx';
import { MarginProps } from '@radix-ui/themes/props';
import { IconType } from '../../../../types/components/BaseTypes.ts';

interface FormSubmitProps extends MarginProps {
  title: string;
  isServerPending?: boolean;
  icon?: IconType;
  color?: ButtonProps['color'];
  width?: string;
}

const FormSubmit = ({
  isServerPending,
  title,
  icon: Icon,
  color,
  width = '100%',
  ...props
}: FormSubmitProps) => {
  const { ...marginProps } = props;

  return (
    <Flex justify="center" align="center" width={width} my="3" {...marginProps}>
      <LoadingSpinner size="small" isLoading={isServerPending}>
        <RadixForm.Submit asChild>
          <Button size="4" color={color} className="!w-full">
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
