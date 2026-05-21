import { ArrowRight, Calendar, Clock, MapPin, Users, Video } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cropConfig } from "../cropConfig";

export const eventRecords = [
  {
    id: "annual-symposium-2026",
    title: `${cropConfig.cropName} Functional Genomics Symposium 2026`,
    date: "June 15-18, 2026",
    time: "9:00 AM - 5:00 PM",
    location: cropConfig.fieldNetwork,
    type: "Conference",
    attendees: "250+",
    format: "Hybrid",
    image: cropConfig.pageImages.events,
    description: `A multi-day meeting focused on ${cropConfig.traitFocus}, population resources, database curation and breeding applications for ${cropConfig.species}.`,
    agenda: ["Keynote reports on crop-specific genome resources", "Trait database curation and quality control roundtable", "Hands-on data exploration with genome browser and nutrition matrices"],
  },
  {
    id: "database-workshop-2026",
    title: `${cropConfig.dbName} Data Curation Workshop`,
    date: "July 22, 2026",
    time: "2:00 PM - 5:30 PM",
    location: "Online training room",
    type: "Workshop",
    attendees: "120+",
    format: "Virtual",
    image: cropConfig.pageImages.tools,
    description: `Training for batch metadata upload, evidence tagging, downloadable file preparation and dashboard interpretation in ${cropConfig.dbName}.`,
    agenda: ["Template preparation for germplasm and omics records", "News and event content workflow", "Export, API and visualization checks"],
  },
  {
    id: "field-day-2026",
    title: `${cropConfig.cropName} Regional Trial Field Day`,
    date: "August 9, 2026",
    time: "8:30 AM - 3:00 PM",
    location: cropConfig.fieldNetwork,
    type: "Field Day",
    attendees: "80+",
    format: "In-person",
    image: cropConfig.heroImage,
    description: `Field plot observation, sample registration and trait scoring demonstrations for ${cropConfig.cropName.toLowerCase()} germplasm panels.`,
    agenda: ["Plot walk and phenotype scoring", "Seed quality sampling workflow", "Breeding decision discussion with trial coordinators"],
  },
  {
    id: "omics-webinar-2026",
    title: `${cropConfig.cropName} Multi-omics Analysis Webinar`,
    date: "September 3, 2026",
    time: "10:30 AM - 12:00 PM",
    location: "Online",
    type: "Webinar",
    attendees: "200+",
    format: "Virtual",
    image: cropConfig.pageImages.research,
    description: `A focused session on expression heatmaps, candidate gene networks and nutrition trait association workflows in ${cropConfig.dbName}.`,
    agenda: ["Expression profile interpretation", "Candidate gene prioritization", "Cross-table evidence export"],
  },
];

const pastEvents = [
  { title: `${cropConfig.dbName} Release Review Meeting`, date: "November 12-14, 2025", location: "Online", type: "Consortium", recording: true },
  { title: `${cropConfig.cropName} Nutrition Trait Workshop`, date: "October 5, 2025", location: cropConfig.fieldNetwork, type: "Workshop", recording: true },
  { title: "Database Launch Webinar", date: "September 15, 2025", location: "Online", type: "Webinar", recording: true },
];

export function Events() {
  const { t } = useTranslation();

  return (
    <div className="relative">
      <div className="mx-auto max-w-7xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[1.75rem] p-8 text-white shadow-xl" style={{ backgroundImage: `linear-gradient(90deg, rgba(15,23,42,.82), rgba(15,23,42,.36)), url(${cropConfig.pageImages.events})`, backgroundSize: "cover", backgroundPosition: "center" }}>
          <div className="relative max-w-4xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur"><Calendar className="h-4 w-4" />{cropConfig.cropName} event calendar</div>
            <h1 className="mb-4 text-4xl font-bold">{t("events.title")}</h1>
            <p className="max-w-3xl text-lg text-white/85">{t("events.subtitle")}</p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75">Events connect database releases, field sampling, omics analysis and community training for {cropConfig.species}.</p>
          </div>
        </section>


        <section className="grid gap-8 border-l-4 py-2 pl-6 lg:grid-cols-3" style={{ borderColor: cropConfig.accent }}>
          <div className="lg:col-span-2">
            <p className="text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: cropConfig.accent }}>Program scope</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">Events connect field work, database curation and analysis training</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              The event calendar is organized around the full database lifecycle: sample collection, phenotype scoring, molecular profiling, data upload, quality review and public communication. Each event record is written to help participants understand what data products or training outcomes are expected.
            </p>
          </div>
          <div className="border-y border-slate-200 py-6 text-slate-900">
            <h3 className="text-xl font-semibold">Common tracks</h3>
            <div className="mt-5 divide-y divide-slate-200 text-sm text-slate-700">
              {["Field sampling", "Curation workshop", "Omics interpretation", "Database release review"].map((item) => <div key={item} className="py-3">{item}</div>)}
            </div>
          </div>
        </section>
        <section className="grid gap-6 lg:grid-cols-2">
          {eventRecords.map((event) => (
            <article key={event.id} className="group overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
              <Link to={`/events/${event.id}`} className="block h-52 overflow-hidden"><img src={event.image} alt={event.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /></Link>
              <div className="p-5">
                <div className="mb-3 flex flex-wrap gap-2"><span className="rounded-full px-3 py-1 text-sm font-medium" style={{ backgroundColor: cropConfig.accentSoft, color: cropConfig.accentDark }}>{event.type}</span><span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">{event.format}</span></div>
                <h3 className="text-2xl font-semibold text-slate-950 group-hover:opacity-80"><Link to={`/events/${event.id}`}>{event.title}</Link></h3>
                <p className="mb-5 mt-3 text-sm leading-6 text-slate-600">{event.description}</p>
                <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                  <span className="flex items-center gap-2"><Calendar className="h-4 w-4" style={{ color: cropConfig.accent }} />{event.date}</span>
                  <span className="flex items-center gap-2"><Clock className="h-4 w-4" style={{ color: cropConfig.accent }} />{event.time}</span>
                  <span className="flex items-center gap-2">{event.format === "Virtual" ? <Video className="h-4 w-4" style={{ color: cropConfig.accent }} /> : <MapPin className="h-4 w-4" style={{ color: cropConfig.accent }} />}{event.location}</span>
                  <span className="flex items-center gap-2"><Users className="h-4 w-4" style={{ color: cropConfig.accent }} />{event.attendees}</span>
                </div>
                <Link to={`/events/${event.id}`} className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ backgroundColor: cropConfig.accent }}>View details <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </article>
          ))}
        </section>

        <section className="border-t border-slate-200 pt-8">
          <h2 className="mb-6 text-2xl font-semibold text-slate-950">{t("events.past")}</h2>
          <div className="grid gap-0 divide-y divide-slate-200 md:grid-cols-2 md:divide-x md:divide-y-0 lg:grid-cols-3">
            {pastEvents.map((event) => (
              <div key={event.title} className="p-5">
                <span className="rounded-full px-3 py-1 text-sm font-medium" style={{ backgroundColor: cropConfig.accentSoft, color: cropConfig.accentDark }}>{event.type}</span>
                <h3 className="mt-3 text-lg font-semibold text-slate-950">{event.title}</h3>
                <p className="mt-3 flex items-center text-sm text-slate-600"><Calendar className="mr-2 h-4 w-4" />{event.date}</p>
                <p className="mt-2 flex items-center text-sm text-slate-600"><MapPin className="mr-2 h-4 w-4" />{event.location}</p>
                {event.recording && <button className="mt-4 inline-flex items-center text-sm font-medium" style={{ color: cropConfig.accent }}><Video className="mr-1 h-4 w-4" />Watch Recording</button>}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
