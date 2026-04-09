import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = ({ items, className = '' }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center text-sm mb-4 ${className}`}
    >
      <ol className="flex items-center">
        <li>
          <Link
            to="/admin-dashboard"
            className="flex items-center font-medium text-gray-800 hover:text-blue-600 transition-colors"
            aria-label="Home"
          >
            <Home className="w-4 h-4 mr-1" />
            Home
          </Link>
        </li>

        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight className="w-4 h-4 mx-1 text-gray-600" aria-hidden="true" />
            {item.href ? (
              <Link
                to={item.href}
                className="text-gray-800 hover:text-blue-600 transition-colors font-medium"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-blue-600 font-semibold">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;