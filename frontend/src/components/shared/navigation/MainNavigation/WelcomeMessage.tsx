import { MeType } from '../../../../store/api/auth.ts';

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
    <p id="welcome-message" className="text-qxam-neutral-light-lighter text-xl">
      {welcomeMessage}
    </p>
  );
};

export default WelcomeMessage;
