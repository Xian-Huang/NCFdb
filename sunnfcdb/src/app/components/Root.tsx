import { Outlet } from "react-router-dom";
import { Navigation } from "./Navigation";
import { useTranslation } from "react-i18next";

export function Root() {
  const { t } = useTranslation();
  
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-green-50 to-white">
      <Navigation />
      <main className="container mx-auto flex-1 px-4 py-6">
        <Outlet />
      </main>
      <footer className="mt-auto bg-green-900 py-8 text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-green-200">{t("footer.copyright")}</p>
        </div>
      </footer>
    </div>
  );
}

