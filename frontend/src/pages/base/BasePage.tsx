import { Card, Container, Flex, Section } from '@radix-ui/themes';
import { PropsWithChildren } from 'react';

const BasePage = ({ children }: PropsWithChildren) => {
  return (
    <Container align="center" height="100%">
      <Section height="100%">
        <Flex align="center" justify="center" height="100%">
          <Card variant="classic" className="lg:w-1/3 w-2/3">
            {children}
          </Card>
        </Flex>
      </Section>
    </Container>
  );
};

export default BasePage;
