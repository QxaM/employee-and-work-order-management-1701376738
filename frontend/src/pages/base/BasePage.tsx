import { Card, Container, Flex, Section } from '@radix-ui/themes';
import { PropsWithChildren } from 'react';
import clsx from 'clsx/lite';

interface BasePageProps {
  className?: string;
}

const BasePage = ({
  className,
  children,
}: PropsWithChildren<BasePageProps>) => {
  const classes = clsx(className ?? 'lg:w-1/3 w-2/3');

  return (
    <Container align="center" height="100%">
      <Section height="100%">
        <Flex align="center" justify="center" height="100%">
          <Card variant="classic" className={classes}>
            {children}
          </Card>
        </Flex>
      </Section>
    </Container>
  );
};

export default BasePage;
