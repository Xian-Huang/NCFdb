import { Outlet, useLocation } from "react-router-dom";
import { Navigation } from "./Navigation";
import { useTranslation } from "react-i18next";

export function Root() {
  const { t } = useTranslation();
  const location = useLocation();
  const footerLanguage = location.pathname.startsWith("/research") ? "en" : undefined;
  
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-amber-50 to-white">
      <Navigation />
      <main className="container mx-auto flex-1 px-4 py-6">
        <Outlet />
      </main>
      <footer className="mt-auto bg-amber-800 py-8 text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-amber-200">{t("footer.copyright", footerLanguage ? { lng: footerLanguage } : undefined)}</p>
        </div>
      </footer>
    </div>
  );
}
