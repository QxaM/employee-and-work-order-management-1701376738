import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center" reloadDocument>
      <img
        src="/maxq-logo.jpg"
        alt="MaxQ Logo with text panel and synthwave background"
        height={32}
        width={32}
        className="m-2 shadow-xl"
      />
      <h1 className="text-qxam-neutral-light-lightest text-lg font-extrabold">
        MaxQ Work Manager
      </h1>
    </Link>
  );
};

export default Logo;
