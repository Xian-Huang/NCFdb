import { ArrowRight, Calendar, Clock, Droplets, MapPin, Users, Video } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Events() {
  const { t } = useTranslation();

  const upcomingEvents = [
    { title: "International Safflower Genomics Symposium 2026", date: "September 15-18, 2026", time: "9:00 - 17:00", location: "Gansu, China", type: "Conference", attendees: "200+", format: "Hybrid", focus: "Drought adaptation, pigment metabolism and oil composition" },
    { title: "Bioinformatics Workshop: Safflower Genome Analysis", date: "June 20, 2026", time: "14:00 - 17:00", location: "Online", type: "Workshop", attendees: "100+", format: "Virtual", focus: "Variant browsing, candidate gene screening and annotation review" },
    { title: "Safflower Breeding Innovation Forum", date: "July 10, 2026", time: "10:00 - 12:00", location: "Online", type: "Webinar", attendees: "150+", format: "Virtual", focus: "Flower color, branching architecture and stress tolerance" },
  ];

  const pastEvents = [
    { title: "Safflower Research Conference 2025", date: "October 15-17, 2025", location: "Beijing, China", type: "Conference" },
    { title: "Functional Genomics Workshop", date: "July 8, 2025", location: "Online", type: "Workshop" },
    { title: "Database Launch & Training Webinar", date: "April 1, 2025", location: "Online", type: "Webinar" },
  ];

  return (
    <div className="space-y-7 text-gray-900">
      <section className="relative overflow-hidden rounded-[1.75rem] bg-red-900 p-8 text-white shadow-xl shadow-red-100">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-gradient-to-l from-red-500/40 to-transparent md:block" />
        <div className="relative max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-500/80 px-4 py-2 text-sm font-medium">
            <Droplets className="h-4 w-4" />
            Safflower field agenda
          </div>
          <h1 className="text-4xl font-bold sm:text-5xl">{t("events.title")}</h1>
          <p className="mt-4 text-base leading-7 text-red-100">{t("events.subtitle")}</p>
        </div>
      </section>

      <section className="space-y-4">
        {upcomingEvents.map((event, index) => (
          <article key={event.title} className="group grid overflow-hidden rounded-xl border border-red-100 bg-white shadow-sm transition-all hover:border-red-200 hover:shadow-lg md:grid-cols-[140px_1fr]">
            <div className="flex flex-col justify-between bg-red-50 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red-700">{event.type}</p>
                <p className="mt-2 text-3xl font-bold text-red-900">0{index + 1}</p>
              </div>
              <span className="mt-4 rounded-full bg-white px-3 py-1 text-xs font-medium text-red-700">{event.format}</span>
            </div>
            <div className="p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-700">{event.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-600">{event.focus}</p>
                </div>
                <button className="inline-flex items-center justify-center gap-2 rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600">
                  {t("events.register")} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-5 grid gap-3 text-sm text-gray-500 sm:grid-cols-2 lg:grid-cols-4">
                <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-red-600" />{event.date}</span>
                <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-red-600" />{event.time}</span>
                <span className="flex items-center gap-2">{event.format === "Virtual" ? <Video className="h-4 w-4 text-red-600" /> : <MapPin className="h-4 w-4 text-red-600" />}{event.location}</span>
                <span className="flex items-center gap-2"><Users className="h-4 w-4 text-red-600" />{event.attendees}</span>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-800">{t("events.past")}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {pastEvents.map((event) => (
            <div key={event.title} className="rounded-xl border border-red-100 bg-white p-4 shadow-sm">
              <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">{event.type}</span>
              <h3 className="mt-3 text-sm font-bold text-gray-800">{event.title}</h3>
              <p className="mt-2 text-xs text-gray-400">{event.date} · {event.location}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl bg-red-50 p-6 text-center">
        <Calendar className="mx-auto mb-3 h-10 w-10 text-red-500" />
        <h2 className="font-semibold text-gray-900">{t("events.subscribe")}</h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-gray-600">{t("events.subscribeDesc")}</p>
      </section>
    </div>
  );
}
