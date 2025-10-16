import { Flex, Text } from '@radix-ui/themes';
import { MessageWithCause } from '../../../types/components/ModalTypes.tsx';

interface ImageUploadErrorProps {
  errorData: MessageWithCause;
}

const MessageWithCauseElement = ({ errorData }: ImageUploadErrorProps) => {
  return (
    <Flex
      direction="column"
      gap="2"
      justify="center"
      align="center"
      flexGrow="1"
    >
      <Text weight="medium">{errorData.message}</Text>
      {
        <ul className="list-disc list-inside">
          {errorData.cause.map((cause) => (
            <li key={cause}>{cause}</li>
          ))}
        </ul>
      }
    </Flex>
  );
};

export default MessageWithCauseElement;
