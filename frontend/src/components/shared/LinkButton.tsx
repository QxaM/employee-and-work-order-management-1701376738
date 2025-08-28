import { Button, ButtonProps } from '@radix-ui/themes';
import { Link } from 'react-router-dom';

interface RadixLinkProps extends ButtonProps {
  to: string;
}

const LinkButton = ({ to, children, ...props }: RadixLinkProps) => {
  return (
    <Button {...props} asChild>
      <Link to={to}>{children}</Link>
    </Button>
  );
};

export default LinkButton;
