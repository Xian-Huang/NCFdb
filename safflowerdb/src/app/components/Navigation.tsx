import { Link, useLocation } from "react-router";
import { Sprout, Menu, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function Navigation() {
  const { t } = useTranslation();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
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
    <nav className="bg-white shadow-md border-t-4 border-red-500">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
              <Sprout className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">{t("home.title")}</span>
              <span className="text-xs text-red-500 block">SafNCFdb</span>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  isActive(item.path)
                    ? "bg-red-100 text-red-800 border-b-2 border-red-500"
                    : "text-gray-600 hover:bg-red-50 hover:text-red-700"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-3 rounded-md text-sm font-medium ${
                  isActive(item.path)
                    ? "bg-red-100 text-red-800"
                    : "text-gray-600 hover:bg-red-50"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
