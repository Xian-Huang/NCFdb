import { Outlet } from "react-router-dom";
import { Navigation } from "./Navigation";
import { useTranslation } from "react-i18next";

export function Root() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-blue-50/30">
      <Navigation />
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
      <footer className="bg-blue-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-blue-200">{t("footer.copyright")}</p>
        </div>
      </footer>
    </div>
  );
}
