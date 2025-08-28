import { Callout, Strong } from '@radix-ui/themes';
import { InfoCircledIcon } from '@radix-ui/react-icons';

const DemoCallout = () => {
  return (
    <Callout.Root>
      <Callout.Icon>
        <InfoCircledIcon />
      </Callout.Icon>
      <Callout.Text>
        <Strong>Demo Environment Notice.</Strong> This demo is hosted on free
        cloud instances that automatically sleep when inactive. Some services
        may take time to wake up, so you might experience brief delays when
        first accessing certain features. This is normal behaviour for the demo
        environment. See below to get status of all our microservices.
      </Callout.Text>
    </Callout.Root>
  );
};

export default DemoCallout;
