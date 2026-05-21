import { Outlet } from "react-router-dom";
import { Navigation } from "./Navigation";
import { useTranslation } from "react-i18next";
import { cropConfig } from "../cropConfig";

export function Root() {
  const { t } = useTranslation();

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-50">
      <div className="pointer-events-none absolute inset-0 -z-10" style={{ background: `radial-gradient(circle at 12% 8%, ${cropConfig.accentSoft} 0, transparent 28%), radial-gradient(circle at 86% 18%, ${cropConfig.accentSoft} 0, transparent 24%), linear-gradient(180deg, #ffffff 0%, #f8fafc 38%, #ffffff 100%)` }} />
      <div className="pointer-events-none absolute left-[-5rem] top-28 -z-10 h-64 w-64 rounded-full opacity-40 blur-3xl" style={{ backgroundColor: cropConfig.accentSoft }} />
      <Navigation />
      <main className="container mx-auto flex-1 px-4 py-6">
        <Outlet />
      </main>
      <footer className="mt-auto border-t border-slate-200 bg-white/85 py-8 backdrop-blur">
        <div className="container mx-auto grid gap-4 px-4 text-sm text-slate-600 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="font-semibold text-slate-950">{cropConfig.dbName}</p>
            <p className="mt-1">{cropConfig.species} · {cropConfig.traitFocus}</p>
          </div>
          <p>{t("footer.copyright")}</p>
        </div>
      </footer>
    </div>
  );
}
