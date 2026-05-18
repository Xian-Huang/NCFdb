import { ArrowRight, Bean, Calendar, Clock, MapPin, Users, Video } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Events() {
  const { t } = useTranslation();

  const upcomingEvents = [
    { title: "International Sesame Genomics Symposium 2026", date: "July 20-23, 2026", time: "9:00 - 17:00", location: "Beijing, China", type: "Conference", attendees: "300+", format: "Hybrid", focus: "Genome resources, lignan metabolism and seed quality improvement" },
    { title: "Bioinformatics Workshop: Sesame Genome Analysis", date: "April 15, 2026", time: "14:00 - 17:00", location: "Online", type: "Workshop", attendees: "150+", format: "Virtual", focus: "Genome browser training, expression matrices and marker lookup" },
    { title: "Sesame Breeding Innovation Forum", date: "May 10, 2026", time: "10:00 - 12:00", location: "Online", type: "Webinar", attendees: "200+", format: "Virtual", focus: "Capsule shattering, yield stability and quality traits" },
  ];

  const pastEvents = [
    { title: "Sesame Genome Consortium Meeting 2025", date: "December 10-12, 2025", location: "Shanghai, China", type: "Conference" },
    { title: "High-Throughput Phenotyping Workshop", date: "November 8, 2025", location: "Online", type: "Workshop" },
    { title: "Database Launch & Training Webinar", date: "October 20, 2025", location: "Online", type: "Webinar" },
  ];

  return (
    <div className="space-y-7 text-slate-900">
      <section className="grid gap-5 rounded-[2rem] border border-green-100 bg-white p-6 shadow-lg shadow-green-100/50 lg:grid-cols-[1fr_260px]">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-green-700">Sesame event register</p>
          <h1 className="text-4xl font-bold text-slate-950 sm:text-5xl">{t("events.title")}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{t("events.subtitle")}</p>
        </div>
        <div className="rounded-[1.5rem] bg-green-50 p-5">
          <Bean className="mb-4 h-8 w-8 text-green-700" />
          <p className="text-sm leading-6 text-slate-600">
            Workshops, consortium meetings and release briefings are arranged as a practical sesame research schedule.
          </p>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        {upcomingEvents.map((event) => (
          <article key={event.title} className="group rounded-[1.5rem] border border-green-100 bg-white p-5 shadow-sm transition-all hover:bg-green-50/40 hover:shadow-lg">
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-800 ring-1 ring-green-100">{event.type}</span>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">{event.format}</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 group-hover:text-green-800">{event.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{event.focus}</p>
            <div className="mt-5 grid gap-3 text-sm text-slate-500 sm:grid-cols-2">
              <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-green-600" />{event.date}</span>
              <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-green-600" />{event.time}</span>
              <span className="flex items-center gap-2">{event.format === "Virtual" ? <Video className="h-4 w-4 text-green-600" /> : <MapPin className="h-4 w-4 text-green-600" />}{event.location}</span>
              <span className="flex items-center gap-2"><Users className="h-4 w-4 text-green-600" />{event.attendees}</span>
            </div>
            <button className="mt-5 inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700">
              {t("events.register")} <ArrowRight className="h-4 w-4" />
            </button>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">{t("events.past")}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {pastEvents.map((event) => (
            <div key={event.title} className="rounded-[1.25rem] border border-green-100 bg-green-50/50 p-4">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-green-700">{event.type}</span>
              <h3 className="mt-2 text-sm font-semibold text-slate-900">{event.title}</h3>
              <p className="mt-2 text-xs text-slate-500">{event.date} · {event.location}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-green-100 bg-green-50 p-6 text-center">
        <Calendar className="mx-auto mb-3 h-10 w-10 text-green-700" />
        <h2 className="font-semibold text-slate-900">{t("events.subscribe")}</h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-600">{t("events.subscribeDesc")}</p>
      </section>
    </div>
  );
}
