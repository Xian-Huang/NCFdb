import { Link, useLocation } from "react-router";
import { Sun } from "lucide-react";
import { Sprout, Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Navigation() {
  const location = useLocation();
  const { t } = useTranslation();
  
  const navItems = [
    { path: "/", label: t("nav.home") },
    { path: "/data", label: t("nav.data") },
    { path: "/news", label: t("nav.news") },
    { path: "/events", label: t("nav.events") },
    { path: "/tools", label: t("nav.tools") },
    { path: "/contact", label: t("nav.contact") },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
           <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <Sun className="h-8 w-8 text-amber-500" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">{t("home.title")}</span>
              <span className="text-xs text-blue-600 block">SunNCFdb</span>
            </div>
          </Link>
          
          <div className="flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-md transition-colors ${
                  isActive(item.path)
                    ? "bg-amber-500 text-white"
                    : "text-gray-700 hover:bg-amber-100"
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
