import { ArrowRight, Calendar, Clock, MapPin, SunMedium, Users, Video } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Events() {
  const { t } = useTranslation();

  const upcomingEvents = [
    {
      title: "International Sunflower Genomics Symposium 2026",
      date: "June 15-18, 2026",
      time: "9:00 AM - 5:00 PM",
      location: "University of California, Davis",
      type: "Conference",
      attendees: "250+",
      format: "Hybrid",
      description: "Genome assembly, population genetics, trait mapping and breeding applications for sunflower research.",
    },
    {
      title: "Bioinformatics Workshop: Genome Browser Tools",
      date: "March 20, 2026",
      time: "2:00 PM - 4:00 PM",
      location: "Online",
      type: "Workshop",
      attendees: "100+",
      format: "Virtual",
      description: "Hands-on training for data visualization, gene annotation and comparative genomics workflows.",
    },
    {
      title: "Pangenome Analysis Webinar",
      date: "March 28, 2026",
      time: "11:00 AM - 12:30 PM",
      location: "Online",
      type: "Webinar",
      attendees: "200+",
      format: "Virtual",
      description: "Latest findings from sunflower pangenome research and applications for breeding programs.",
    },
    {
      title: "Field Day: Sunflower Diversity and Breeding",
      date: "July 10, 2026",
      time: "8:00 AM - 3:00 PM",
      location: "USDA Agricultural Research Station, Fargo, ND",
      type: "Field Day",
      attendees: "80+",
      format: "In-person",
      description: "Experimental plot tours, demonstrations and practical discussions with breeding teams.",
    },
  ];

  const pastEvents = [
    { title: "Annual Consortium Meeting 2025", date: "November 12-14, 2025", location: "Paris, France", type: "Conference", recording: true },
    { title: "RNA-seq Data Analysis Workshop", date: "October 5, 2025", location: "Online", type: "Workshop", recording: true },
    { title: "Database Launch Webinar", date: "September 15, 2025", location: "Online", type: "Webinar", recording: true },
  ];

  return (
    <div className="bg-[#f8faf5]">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] bg-gradient-to-br from-amber-500 via-yellow-400 to-lime-300 p-8 text-slate-950 shadow-xl shadow-amber-100">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-amber-800">
            <SunMedium className="h-4 w-4" />
            Sunflower event calendar
          </div>
          <h1 className="mb-4 text-4xl font-bold">{t("events.title")}</h1>
          <p className="max-w-3xl text-lg text-slate-700">{t("events.subtitle")}</p>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          {upcomingEvents.map((event) => (
            <article key={event.title} className="group overflow-hidden rounded-[1.5rem] border border-amber-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="border-b border-amber-100 bg-amber-50/70 p-5">
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">{event.type}</span>
                  <span className="rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-700">{event.format}</span>
                </div>
                <h3 className="text-2xl font-semibold group-hover:text-amber-700">{event.title}</h3>
              </div>
              <div className="p-5">
                <p className="mb-5 text-sm leading-6 text-gray-600">{event.description}</p>
                <div className="grid gap-3 text-sm text-gray-600 sm:grid-cols-2">
                  <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-amber-500" />{event.date}</span>
                  <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-amber-500" />{event.time}</span>
                  <span className="flex items-center gap-2">{event.format === "Virtual" ? <Video className="h-4 w-4 text-amber-500" /> : <MapPin className="h-4 w-4 text-amber-500" />}{event.location}</span>
                  <span className="flex items-center gap-2"><Users className="h-4 w-4 text-amber-500" />{event.attendees}</span>
                </div>
                <button className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-600">
                  {t("events.register")} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </section>

        <section>
          <h2 className="mb-6 text-2xl font-semibold">{t("events.past")}</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pastEvents.map((event) => (
              <div key={event.title} className="rounded-[1.25rem] border border-amber-100 bg-white p-5 shadow-sm">
                <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">{event.type}</span>
                <h3 className="mt-3 text-lg font-semibold">{event.title}</h3>
                <p className="mt-3 flex items-center text-sm text-gray-600"><Calendar className="mr-2 h-4 w-4" />{event.date}</p>
                <p className="mt-2 flex items-center text-sm text-gray-600"><MapPin className="mr-2 h-4 w-4" />{event.location}</p>
                {event.recording && (
                  <button className="mt-4 inline-flex items-center text-sm font-medium text-amber-700 hover:text-amber-800">
                    <Video className="mr-1 h-4 w-4" />
                    Watch Recording
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[1.75rem] bg-slate-950 p-8 text-center text-white">
          <Calendar className="mx-auto mb-4 h-12 w-12 text-amber-400" />
          <h2 className="mb-3 text-2xl font-bold">{t("events.subscribe")}</h2>
          <p className="mx-auto max-w-2xl text-slate-300">{t("events.subscribeDesc")}</p>
        </section>
      </div>
    </div>
  );
}
