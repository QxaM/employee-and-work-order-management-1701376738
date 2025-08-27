import { Flex, Heading, Text } from '@radix-ui/themes';
import { IconType } from '../../../../types/components/BaseTypes.ts';

interface FormHeaderProps {
  title: string;
  icon: IconType;
  description?: string;
}

const FormHeader = ({ title, description, icon: Icon }: FormHeaderProps) => {
  return (
    <Flex justify="center" align="center" direction="column" mb="6">
      <Flex
        justify="center"
        align="center"
        mb="4"
        className="bg-(--accent-a3) text-(--accent-a11) size-(--font-size-9) rounded-(--radius-5) shadow-(--shadow-2)"
      >
        <Icon
          strokeWidth={0.25}
          stroke="currentColor"
          className="size-(--font-size-8)"
        />
      </Flex>
      <Heading as="h2" size="7" weight="bold" mb="2">
        {title}
      </Heading>
      {description && (
        <Text as="p" size="2" align="center">
          {description}
        </Text>
      )}
    </Flex>
  );
};

export default FormHeader;
