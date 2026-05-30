import { useEffect, useState, type ReactNode } from "react";
import { Building2, Globe, Mail, MapPin, Phone, Send, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cropConfig } from "../cropConfig";

type Institution = Record<string, any>;

const hasCjk = (value: unknown) => /[\u3400-\u9fff]/.test(String(value ?? ""));
const cleanText = (value: unknown, fallback: string) => { const text = String(value ?? "").trim(); return text && hasCjk(text) ? text : fallback; };
const asArray = (value: unknown): Institution[] => Array.isArray(value) ? value as Institution[] : value && typeof value === "object" && Array.isArray((value as { results?: unknown }).results) ? (value as { results: Institution[] }).results : [];

export function Contact() {
  const { t } = useTranslation();
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const fallbackPartners = [t("contact.fallbacks.partner1"), t("contact.fallbacks.partner2"), t("contact.fallbacks.partner3")];

  useEffect(() => {
    fetch("/api/institutions/?limit=12").then((response) => response.ok ? response.json() : []).then((data) => setInstitutions(asArray(data))).catch(() => setInstitutions([]));
  }, []);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[1.75rem] p-8 text-white shadow-xl" style={{ backgroundImage: `linear-gradient(90deg, rgba(15,23,42,.84), rgba(15,23,42,.36)), url(${cropConfig.pageImages.contact})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="relative max-w-4xl"><p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/75">{t("contact.heroEyebrow")}</p><h1 className="mt-3 text-4xl font-bold">{t("contact.title")}</h1><p className="mt-3 max-w-3xl text-base leading-7 text-white/82">{t("contact.subtitle")}</p><p className="mt-4 max-w-3xl text-sm leading-7 text-white/70">{t("common.databaseDescription")}</p></div>
      </section>


      <section className="grid gap-8 border-l-4 py-2 pl-6 lg:grid-cols-[1.1fr_0.9fr]" style={{ borderColor: cropConfig.accent }}>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: cropConfig.accent }}>{t("contact.profileEyebrow")}</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">{t("contact.profileTitle")}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            {t("contact.profileDesc1")}
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            {t("contact.profileDesc2")}
          </p>
        </div>
        <div className="border-y border-slate-200 py-6 text-slate-900">
          <h3 className="text-xl font-semibold">{t("contact.requestsTitle")}</h3>
          <div className="mt-5 divide-y divide-slate-200 text-sm text-slate-700">
            {[t("contact.requests.dataset"), t("contact.requests.vocabulary"), t("contact.requests.browser"), t("contact.requests.training")].map((item) => (
              <div key={item} className="py-3">{item}</div>
            ))}
          </div>
        </div>
      </section>
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[1.25rem] border border-slate-200 bg-white p-6 shadow-sm"><h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900"><Send className="h-5 w-5" style={{ color: cropConfig.accent }} />{t("contact.form")}</h2><form className="space-y-4"><Field label={t("contact.name")} placeholder={t("contact.name")} /><Field label={t("contact.email")} placeholder={t("contact.emailPlaceholder")} type="email" /><Field label={t("contact.subject")} placeholder={t("contact.subject")} /><div><label className="mb-1 block text-sm font-medium text-slate-700">{t("contact.message")}</label><textarea rows={5} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2" placeholder={t("contact.message")} /></div><button type="submit" className="w-full rounded-xl py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ backgroundColor: cropConfig.accent }}>{t("contact.send")}</button></form></section>

        <div className="space-y-6">
          <section className="border-y border-slate-200 py-6"><h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-slate-900"><Mail className="h-5 w-5" style={{ color: cropConfig.accent }} />{t("contact.info")}</h2><div className="grid gap-4 sm:grid-cols-2"><Info icon={<MapPin className="h-5 w-5" />} label={t("contact.address")} value={cropConfig.fieldNetwork} /><Info icon={<Mail className="h-5 w-5" />} label={t("contact.email")} value={`contact@${cropConfig.key}.org`} /><Info icon={<Phone className="h-5 w-5" />} label={t("contact.phone")} value="+86 10 1234 5678" /><Info icon={<Globe className="h-5 w-5" />} label={t("contact.website")} value={`www.${cropConfig.key}.org`} /></div></section>

          <section className="py-1"><div className="mb-5 flex items-center justify-between gap-4"><div><h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900"><Users className="h-5 w-5" style={{ color: cropConfig.accent }} />{t("contact.collaborators")}</h2><p className="mt-1 text-sm text-slate-500">{t("contact.partnerNote")}</p></div><span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: cropConfig.accentSoft, color: cropConfig.accentDark }}>{t("contact.consortium")}</span></div><div className="grid gap-3 md:grid-cols-2">{(institutions.length ? institutions : fallbackPartners.map((name, id) => ({ id, name }))).map((item, index) => <article key={item.id ?? index} className="border-l border-slate-200 py-2 pl-4"><div className="flex items-start gap-3"><Building2 className="mt-0.5 h-5 w-5" style={{ color: cropConfig.accent }} /><div className="min-w-0"><h3 className="truncate font-semibold text-slate-900">{cleanText(item.abbreviation || item.name, t("contact.fallbacks.institution"))}</h3><p className="mt-1 text-sm text-slate-500">{cleanText(item.institution_type, t("contact.fallbacks.partner"))} · {cleanText(item.city || item.country, t("contact.fallbacks.location"))}</p><p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{cleanText(item.website || item.email || item.description, t("contact.fallbacks.profile"))}</p></div></div></article>)}</div></section>
        </div>
      </div>
    </div>
  );
}

function Field({ label, placeholder, type = "text" }: { label: string; placeholder: string; type?: string }) { return <div><label className="mb-1 block text-sm font-medium text-slate-700">{label}</label><input type={type} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2" placeholder={placeholder} /></div>; }
function Info({ icon, label, value }: { icon: ReactNode; label: string; value: string }) { return <div className="flex items-start gap-3 text-sm"><div style={{ color: cropConfig.accent }}>{icon}</div><div><div className="font-medium text-slate-900">{label}</div><div className="mt-1 text-slate-500">{value}</div></div></div>; }
