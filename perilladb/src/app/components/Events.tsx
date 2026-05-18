import { ArrowRight, Calendar, Clock, Flower2, MapPin, Users, Video } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Events() {
  const { t } = useTranslation();

  const upcomingEvents = [
    { title: "International Perilla Genomics Symposium 2026", date: "October 15-18, 2026", time: "9:00 - 17:00", location: "Changchun, China", type: "Conference", attendees: "150+", format: "Hybrid", focus: "Perilla genome resources, aromatic metabolism and seed oil diversity" },
    { title: "Bioinformatics Workshop: Perilla Genome Analysis", date: "July 20, 2026", time: "14:00 - 17:00", location: "Online", type: "Workshop", attendees: "80+", format: "Virtual", focus: "Gene annotation, expression mining and variation queries" },
    { title: "Perilla Breeding Innovation Forum", date: "August 10, 2026", time: "10:00 - 12:00", location: "Online", type: "Webinar", attendees: "120+", format: "Virtual", focus: "Leaf color, aroma traits and functional food breeding" },
  ];

  const pastEvents = [
    { title: "Perilla Research Conference 2025", date: "November 5-7, 2025", location: "Tokyo, Japan", type: "Conference" },
    { title: "Functional Genomics Workshop", date: "August 15, 2025", location: "Online", type: "Workshop" },
    { title: "Database Launch & Training Webinar", date: "March 1, 2025", location: "Online", type: "Webinar" },
  ];

  return (
    <div className="space-y-7 bg-gradient-to-b from-purple-50/60 to-white text-gray-900">
      <section className="rounded-[2rem] border border-purple-100 bg-white p-8 text-center shadow-xl shadow-purple-100/70">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-purple-700">
          <Flower2 className="h-7 w-7" />
        </div>
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-purple-700">Perilla event garden</p>
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">{t("events.title")}</h1>
        <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-gray-600">{t("events.subtitle")}</p>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {upcomingEvents.map((event, index) => (
          <article key={event.title} className="group flex min-h-full flex-col rounded-2xl border border-purple-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-100">
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">{event.type}</span>
              <span className="text-sm font-bold text-purple-300">0{index + 1}</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-700">{event.title}</h3>
            <p className="mt-3 flex-1 text-sm leading-6 text-gray-600">{event.focus}</p>
            <div className="mt-5 space-y-2 text-sm text-gray-500">
              <p className="flex items-center gap-2"><Calendar className="h-4 w-4 text-purple-600" />{event.date}</p>
              <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-purple-600" />{event.time}</p>
              <p className="flex items-center gap-2">{event.format === "Virtual" ? <Video className="h-4 w-4 text-purple-600" /> : <MapPin className="h-4 w-4 text-purple-600" />}{event.location}</p>
              <p className="flex items-center gap-2"><Users className="h-4 w-4 text-purple-600" />{event.attendees}</p>
            </div>
            <button className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-purple-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-100 transition-colors hover:bg-purple-600">
              {t("events.register")} <ArrowRight className="h-4 w-4" />
            </button>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{t("events.past")}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {pastEvents.map((event) => (
            <div key={event.title} className="rounded-xl bg-purple-50/70 p-4">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-purple-600">{event.type}</span>
              <h3 className="mt-2 text-sm font-bold text-gray-800">{event.title}</h3>
              <p className="mt-2 text-xs text-gray-500">{event.date} · {event.location}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-purple-100 bg-purple-50 p-6 text-center">
        <Calendar className="mx-auto mb-3 h-10 w-10 text-purple-600" />
        <h2 className="font-semibold text-gray-900">{t("events.subscribe")}</h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-gray-600">{t("events.subscribeDesc")}</p>
      </section>
    </div>
  );
}
