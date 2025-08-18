import { Button, ButtonProps } from '@radix-ui/themes';
import { Link } from 'react-router-dom';

interface RadixLinkProps extends ButtonProps {
  to: string;
}

const RadixLink = ({ to, children, ...props }: RadixLinkProps) => {
  return (
    <Button {...props}>
      <Link to={to}>{children}</Link>
    </Button>
  );
};

export default RadixLink;
