import { MeType } from '../../../../store/api/auth.ts';
import { Text } from '@radix-ui/themes';

interface WelcomeMessageProps {
  me?: MeType;
}

/**
 * Functional component that generates a personalized welcome message.
 *
 * The `WelcomeMessage` component displays a greeting message to the user.
 * If a user object is provided via the `me` prop, the greeting will include the user's email address.
 * Otherwise, a generic welcome message is shown.
 *
 * @param {WelcomeMessageProps} props - The properties passed to the component.
 * @param {Object} props.me - An optional object representing the user.
 */
const WelcomeMessage = ({ me }: WelcomeMessageProps) => {
  const welcomeMessage = 'Welcome back' + (me ? `, ${me.email}` : '') + '!';

  return (
    <Text as="p" id="welcome-message" size="3">
      {welcomeMessage}
    </Text>
  );
};

export default WelcomeMessage;
