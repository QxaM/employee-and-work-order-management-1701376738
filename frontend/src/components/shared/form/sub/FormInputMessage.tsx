import { Form } from 'radix-ui';
import { Flex, Text } from '@radix-ui/themes';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

interface RadixInputMessageProps extends Form.FormMessageProps {
  title: string;
}

const FormInputMessage = (props: RadixInputMessageProps) => {
  const { title, ...rest } = props;

  return (
    <Form.Message {...rest}>
      <Flex
        direction="row"
        gap="2"
        justify="start"
        align="center"
        className="text-(--red-11)"
      >
        <ExclamationTriangleIcon />
        <Text as="p" size="2" className="first-letter:uppercase">
          {title}
        </Text>
      </Flex>
    </Form.Message>
  );
};

export default FormInputMessage;
