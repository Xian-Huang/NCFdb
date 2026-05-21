import { Outlet } from "react-router-dom";
import { Navigation } from "./Navigation";
import { useTranslation } from "react-i18next";
import { cropConfig } from "../cropConfig";

export function Root() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: cropConfig.accentSoft }}>
      <div className="pointer-events-none absolute inset-0 -z-10" style={{ background: `radial-gradient(circle at 12% 8%, ${cropConfig.accentSoft} 0, transparent 28%), radial-gradient(circle at 86% 18%, ${cropConfig.accentSoft} 0, transparent 24%), linear-gradient(180deg, #ffffff 0%, #f8fafc 38%, #ffffff 100%)` }} />
      <div className="pointer-events-none absolute left-[-5rem] top-28 -z-10 h-64 w-64 rounded-full opacity-40 blur-3xl" style={{ backgroundColor: cropConfig.accentSoft }} />
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
