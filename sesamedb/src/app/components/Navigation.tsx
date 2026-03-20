import { Link, useLocation } from "react-router";
import { Sprout } from "lucide-react";

export function Navigation() {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "Home" },
    { path: "/data", label: "Data" },
    { path: "/news", label: "News" },
    { path: "/events", label: "Events" },
    { path: "/tools", label: "Tools" },
    { path: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-green-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Sprout className="h-8 w-8 text-green-600" />
            <span className="text-xl font-semibold text-gray-900">
              SesameDB
            </span>
          </Link>
          
          <div className="flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-md transition-colors ${
                  isActive(item.path)
                    ? "bg-green-600 text-white"
                    : "text-gray-700 hover:bg-green-100"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
