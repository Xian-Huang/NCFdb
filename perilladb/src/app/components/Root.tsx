import { Outlet } from "react-router-dom";
import { Navigation } from "./Navigation";
import { useTranslation } from "react-i18next";
import { cropConfig } from "../cropConfig";

export function Root() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: cropConfig.accentSoft }}>
      <Navigation />
      <main className="container mx-auto flex-1 px-4 py-6">
        <Outlet />
      </main>
      <footer className="mt-auto py-8 text-white" style={{ backgroundColor: cropConfig.accentDark }}>
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/75">{t("footer.copyright")}</p>
        </div>
      </footer>
    </div>
  );
}
