import { Outlet, useLocation } from "react-router-dom";
import { Navigation } from "./Navigation";
import { useTranslation } from "react-i18next";

export function Root() {
  const { t } = useTranslation();
  const location = useLocation();
  const footerLanguage = location.pathname.startsWith("/research") ? "en" : undefined;

  return (
    <div className="flex min-h-screen flex-col bg-purple-50/30">
      <Navigation />
      <main className="container mx-auto flex-1 px-4 py-6">
        <Outlet />
      </main>
      <footer className="mt-auto bg-purple-800 py-8 text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-purple-200">{t("footer.copyright", footerLanguage ? { lng: footerLanguage } : undefined)}</p>
        </div>
      </footer>
    </div>
  );
}
