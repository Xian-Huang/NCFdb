import { ArrowRight, Calendar, Clock, MapPin, Microscope, Users, Video } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Events() {
  const { t } = useTranslation();

  const upcomingEvents = [
    {
      title: "International Flax Genomics Symposium 2026",
      date: "August 15-18, 2026",
      time: "9:00 - 17:00",
      location: "Saskatoon, Canada",
      type: "Conference",
      attendees: "200+",
      format: "Hybrid",
      focus: "Genome assembly, oil traits and bast fiber improvement",
    },
    {
      title: "Bioinformatics Workshop: Flax Genome Analysis",
      date: "May 20, 2026",
      time: "14:00 - 17:00",
      location: "Online",
      type: "Workshop",
      attendees: "100+",
      format: "Virtual",
      focus: "Hands-on annotation and genome browser workflows",
    },
    {
      title: "Flax Breeding Innovation Forum",
      date: "June 15, 2026",
      time: "10:00 - 12:00",
      location: "Online",
      type: "Webinar",
      attendees: "150+",
      format: "Virtual",
      focus: "Trait mapping, germplasm exchange and breeding decisions",
    },
  ];

  const pastEvents = [
    { title: "Flax and Bast Fiber Conference 2025", date: "November 10-12, 2025", location: "Harbin, China", type: "Conference" },
    { title: "High-Throughput Phenotyping Workshop", date: "September 8, 2025", location: "Online", type: "Workshop" },
    { title: "Database Launch & Training Webinar", date: "August 1, 2025", location: "Online", type: "Webinar" },
  ];

  return (
    <div className="space-y-7 text-slate-900">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 shadow-2xl shadow-blue-100">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="p-8 text-white sm:p-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-300/30 bg-blue-400/10 px-4 py-2 text-sm font-medium text-blue-100">
              <Calendar className="h-4 w-4" />
              Flax research calendar
            </div>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">{t("events.title")}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">{t("events.subtitle")}</p>
          </div>
          <div className="grid border-t border-white/10 bg-white p-5 lg:border-l lg:border-t-0">
            <div className="rounded-[1.5rem] border border-blue-100 bg-blue-50 p-6">
              <Microscope className="mb-4 h-8 w-8 text-blue-700" />
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Program focus</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Meetings are organized around flax genome resources, fiber quality, oil biosynthesis and practical database training.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">{t("events.upcoming")}</p>
          <div className="mt-5 space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.title} className="border-l-2 border-blue-500 pl-4">
                <p className="text-sm font-semibold text-slate-900">{event.date}</p>
                <p className="mt-1 text-xs text-slate-500">{event.type} · {event.format}</p>
              </div>
            ))}
          </div>
        </aside>

        <div className="space-y-4">
          {upcomingEvents.map((event) => (
            <article key={event.title} className="group rounded-[1.35rem] border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">{event.type}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{event.format}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-700">{event.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{event.focus}</p>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><Calendar className="h-4 w-4 text-blue-600" />{event.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-blue-600" />{event.time}</span>
                    <span className="flex items-center gap-1">{event.format === "Virtual" ? <Video className="h-4 w-4 text-blue-600" /> : <MapPin className="h-4 w-4 text-blue-600" />}{event.location}</span>
                    <span className="flex items-center gap-1"><Users className="h-4 w-4 text-blue-600" />{event.attendees}</span>
                  </div>
                </div>
                <button className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700">
                  {t("events.register")} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-800">{t("events.past")}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {pastEvents.map((event) => (
            <div key={event.title} className="rounded-[1.25rem] border border-slate-200 bg-white p-4 shadow-sm">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{event.type}</span>
              <h3 className="mt-3 text-sm font-semibold text-slate-900">{event.title}</h3>
              <p className="mt-2 text-xs text-slate-400">{event.date} · {event.location}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-blue-100 bg-blue-50 p-6 text-center">
        <Calendar className="mx-auto mb-3 h-10 w-10 text-blue-600" />
        <h2 className="font-semibold text-slate-900">{t("events.subscribe")}</h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-600">{t("events.subscribeDesc")}</p>
      </section>
    </div>
  );
}
