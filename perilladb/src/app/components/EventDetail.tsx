import { ArrowLeft, Calendar, Clock, MapPin, Users } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { cropConfig } from "../cropConfig";
import { eventRecords } from "./Events";
import { useTranslation } from "react-i18next";

export function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const event = eventRecords.find((item) => item.id === id);
  const zhCropName = (cropConfig as typeof cropConfig & { zhCropName?: string }).zhCropName || cropConfig.cropName;
  const zhTraitFocus = (cropConfig as typeof cropConfig & { zhTraitFocus?: string }).zhTraitFocus || cropConfig.traitFocus;

  if (!event) {
    return <div className="mx-auto max-w-4xl px-4 py-12 text-center"><h1 className="text-2xl font-bold text-slate-950">{t("events.notFound")}</h1><Link to="/events" className="mt-4 inline-block" style={{ color: cropConfig.accent }}>{t("events.backList")}</Link></div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <Link to="/events" className="mb-6 inline-flex items-center text-slate-600 hover:opacity-80"><ArrowLeft className="mr-2 h-4 w-4" />{t("events.backList")}</Link>
      <article className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-xl">
        <section className="relative min-h-[380px] overflow-hidden text-white">
          <img src={event.image} alt={event.title} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-transparent" />
          <div className="relative flex min-h-[380px] flex-col justify-end p-8 md:p-10">
            <div className="mb-4 flex flex-wrap gap-2"><span className="rounded-full bg-white/15 px-3 py-1 text-sm font-semibold backdrop-blur">{event.type}</span><span className="rounded-full bg-white/15 px-3 py-1 text-sm font-semibold backdrop-blur">{event.format}</span></div>
            <h1 className="max-w-4xl text-4xl font-bold leading-tight md:text-5xl">{event.title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/80">{event.description}</p>
          </div>
        </section>
        <section className="grid gap-8 p-6 md:grid-cols-[1fr_320px] md:p-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">{t("events.detailTitle")}</h2>
            <p className="mt-4 text-base leading-8 text-slate-600">{t("events.detailDesc", { crop: zhCropName, trait: zhTraitFocus })}</p>
            <div className="mt-8 rounded-2xl border border-slate-200 p-5" style={{ backgroundColor: cropConfig.accentSoft }}>
              <h3 className="text-lg font-semibold text-slate-950">{t("events.agendaFocus")}</h3>
              <div className="mt-4 space-y-3">
                {event.agenda.map((item, index) => <div key={item} className="flex gap-3 rounded-xl bg-white/80 p-3 text-sm text-slate-700"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white" style={{ backgroundColor: cropConfig.accent }}>{index + 1}</span><span>{item}</span></div>)}
              </div>
            </div>
          </div>
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">{t("events.infoTitle")}</h2>
            <div className="mt-5 space-y-4 text-sm text-slate-600">
              <Info icon={<Calendar className="h-4 w-4" />} label={t("events.date")} value={event.date} />
              <Info icon={<Clock className="h-4 w-4" />} label={t("events.time")} value={event.time} />
              <Info icon={<MapPin className="h-4 w-4" />} label={t("events.location")} value={event.location} />
              <Info icon={<Users className="h-4 w-4" />} label={t("events.attendees")} value={event.attendees} />
            </div>
            <button className="mt-6 w-full rounded-xl px-4 py-3 text-sm font-semibold text-white" style={{ backgroundColor: cropConfig.accent }}>{t("events.registerInterest")}</button>
          </aside>
        </section>
      </article>
    </div>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="flex gap-3"><div style={{ color: cropConfig.accent }}>{icon}</div><div><div className="font-medium text-slate-950">{label}</div><div className="mt-1">{value}</div></div></div>;
}
