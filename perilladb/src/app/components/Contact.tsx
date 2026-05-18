import { useEffect, useState, type ReactNode } from "react";
import { Building2, Globe, Mail, MapPin, Phone, Send, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

type Institution = Record<string, any>;

const fallbackPartners = [
  "Chinese Academy of Agricultural Sciences",
  "National Crop Improvement Center",
  "International Research Network",
];

const hasCjk = (value: unknown) => /[\u3400-\u9fff]/.test(String(value ?? ""));
const cleanText = (value: unknown, fallback: string) => {
  const text = String(value ?? "").trim();
  if (!text || hasCjk(text)) return fallback;
  return text;
};

const asArray = (value: unknown): Institution[] => {
  if (Array.isArray(value)) return value as Institution[];
  if (value && typeof value === "object" && Array.isArray((value as { results?: unknown }).results)) {
    return (value as { results: Institution[] }).results;
  }
  return [];
};

export function Contact() {
  const { t } = useTranslation();
  const [institutions, setInstitutions] = useState<Institution[]>([]);

  useEffect(() => {
    fetch("/api/institutions/?limit=12")
      .then((response) => response.ok ? response.json() : [])
      .then((data) => setInstitutions(asArray(data)))
      .catch(() => setInstitutions([]));
  }, []);

  return (
    <div className="space-y-8">
      <section className="border border-purple-100 bg-gradient-to-br from-purple-50 to-violet-50 p-7 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-purple-700">About & Contact</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950">{t("contact.title")}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{t("contact.subtitle")}</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900"><Send className="h-5 w-5 text-purple-600" />{t("contact.form")}</h2>
          <form className="space-y-4">
            <Field label={t("contact.name")} placeholder={t("contact.name")} />
            <Field label={t("contact.email")} placeholder="your@email.com" type="email" />
            <Field label={t("contact.subject")} placeholder={t("contact.subject")} />
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">{t("contact.message")}</label>
              <textarea rows={5} className="w-full border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-500" placeholder={t("contact.message")} />
            </div>
            <button type="submit" className="w-full bg-purple-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-700">
              {t("contact.send")}
            </button>
          </form>
        </section>

        <div className="space-y-6">
          <section className="border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-slate-900"><Mail className="h-5 w-5 text-purple-600" />{t("contact.info")}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Info icon={<MapPin className="h-5 w-5" />} label={t("contact.address")} value="Beijing, China" />
              <Info icon={<Mail className="h-5 w-5" />} label={t("contact.email")} value="contact@perilladb.org" />
              <Info icon={<Phone className="h-5 w-5" />} label={t("contact.phone")} value="+86 10 1234 5678" />
              <Info icon={<Globe className="h-5 w-5" />} label={t("contact.website")} value="www.perilladb.org" />
            </div>
          </section>

          <section className="border border-purple-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900"><Users className="h-5 w-5 text-purple-600" />{t("contact.collaborators")}</h2>
                <p className="mt-1 text-sm text-slate-500">Partner institutions are maintained here so analysis pages can stay focused on data exploration.</p>
              </div>
              <span className="bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">Perilla Trait Data Consortium</span>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {(institutions.length ? institutions : fallbackPartners.map((name, id) => ({ id, name }))).map((item, index) => (
                <article key={item.id ?? index} className="border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <Building2 className="mt-0.5 h-5 w-5 text-purple-600" />
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-slate-900">{cleanText(item.abbreviation || item.name, "Institution translation pending")}</h3>
                      <p className="mt-1 text-sm text-slate-500">{cleanText(item.institution_type, "Research partner")} · {cleanText(item.city || item.country, "Location pending")}</p>
                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{cleanText(item.website || item.email || item.description, "Institution profile pending")}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Field({ label, placeholder, type = "text" }: { label: string; placeholder: string; type?: string }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <input type={type} className="w-full border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-500" placeholder={placeholder} />
    </div>
  );
}

function Info({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <div className="text-purple-600">{icon}</div>
      <div>
        <div className="font-medium text-slate-900">{label}</div>
        <div className="mt-1 text-slate-500">{value}</div>
      </div>
    </div>
  );
}