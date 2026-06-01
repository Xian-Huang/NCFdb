import { Link, useLocation } from "react-router-dom";
import { Sprout } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cropConfig } from "../cropConfig";

export function Navigation() {
  const location = useLocation();
  const { t } = useTranslation();
  const navText = (key: string) => t(key);
  
  const navItems = [
    { path: "/", label: navText("nav.home") },
    { path: "/data", label: navText("nav.data") },
    { path: "/news", label: navText("nav.news") },
    { path: "/events", label: navText("nav.events") },
    { path: "/tools", label: navText("nav.tools") },
    { path: "/contact", label: navText("nav.contact") },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="border-b bg-white shadow-sm" style={{ borderColor: `${cropConfig.accent}33` }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center">
              <Sprout className="h-8 w-8" style={{ color: cropConfig.accent }} />
            </div>
            <div>
              <span className="text-xl font-bold">{t("home.title")}</span>
              <span className="text-xs text-black-600 block">{navText("home.subtitle")}</span>
            </div>
          </Link>
          
          <div className="flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`rounded-md px-4 py-2 transition-colors ${isActive(item.path) ? "text-white" : "text-gray-700"}`}
                style={isActive(item.path) ? { backgroundColor: cropConfig.accent } : undefined}
                onMouseEnter={(event) => {
                  if (!isActive(item.path)) event.currentTarget.style.backgroundColor = cropConfig.accentSoft;
                }}
                onMouseLeave={(event) => {
                  if (!isActive(item.path)) event.currentTarget.style.backgroundColor = "";
                }}
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
