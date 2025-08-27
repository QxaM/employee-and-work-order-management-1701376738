import { Flex, Text } from '@radix-ui/themes';

const Footer = () => {
  return (
    <Flex
      justify="center"
      align="center"
      height="2rem"
      width="100%"
      className="bg-(--gray-a3) sticky bottom-0"
    >
      <Text as="p" size="2">
        Piotr Gliszczyński &copy; 2024
      </Text>
    </Flex>
  );
};

export default Footer;
