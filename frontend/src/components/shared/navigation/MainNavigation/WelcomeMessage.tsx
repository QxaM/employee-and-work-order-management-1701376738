import { MeType } from '../../../../store/api/auth.ts';

interface WelcomeMessageProps {
  me?: MeType;
}

const WelcomeMessage = ({ me }: WelcomeMessageProps) => {
  const welcomeMessage = 'Welcome back' + (me ? `, ${me.email}` : '') + '!';

  return (
    <p id="welcome-message" className="text-qxam-neutral-light-lighter text-xl">
      {welcomeMessage}
    </p>
  );
};

export default WelcomeMessage;
