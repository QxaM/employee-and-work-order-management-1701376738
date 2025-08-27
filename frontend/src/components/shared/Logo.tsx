import { Link } from 'react-router-dom';
import { Avatar, Heading } from '@radix-ui/themes';

const Logo = () => {
  return (
    <Link
      to="/"
      className="flex items-center text-(--accent-contrast)"
      reloadDocument
    >
      <Avatar
        src="/maxq-logo.jpg"
        alt="MaxQ Logo with text panel and synthwave background"
        size="3"
        m="1"
        fallback="M"
      />
      <Heading as="h1" weight="bold" size="5">
        MaxQ Work Manager
      </Heading>
    </Link>
  );
};

export default Logo;
