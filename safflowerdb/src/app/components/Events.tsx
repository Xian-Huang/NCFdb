import { Calendar, MapPin, Clock, Users, Video } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Events() {
  const { t } = useTranslation();
  
  const upcomingEvents = [
    {
      title: "International Sesame Genomics Symposium 2026",
      date: "July 20-23, 2026",
      time: "9:00 - 17:00",
      location: "Beijing, China",
      type: "Conference",
      attendees: "300+",
      format: "Hybrid",
    },
    {
      title: "Bioinformatics Workshop: Sesame Genome Analysis",
      date: "April 15, 2026",
      time: "14:00 - 17:00",
      location: "Online",
      type: "Workshop",
      attendees: "150+",
      format: "Virtual",
    },
    {
      title: "Sesame Breeding Innovation Forum",
      date: "May 10, 2026",
      time: "10:00 - 12:00",
      location: "Online",
      type: "Webinar",
      attendees: "200+",
      format: "Virtual",
    },
  ];

  const pastEvents = [
    {
      title: "Sesame Genome Consortium Meeting 2025",
      date: "December 10-12, 2025",
      location: "Shanghai, China",
      type: "Conference",
    },
    {
      title: "High-Throughput Phenotyping Workshop",
      date: "November 8, 2025",
      location: "Online",
      type: "Workshop",
    },
    {
      title: "Database Launch & Training Webinar",
      date: "October 20, 2025",
      location: "Online",
      type: "Webinar",
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{t("events.title")}</h1>
        <p className="text-gray-500">{t("events.subtitle")}</p>
      </div>

      {/* Upcoming */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">{t("events.upcoming")}</h2>
        <div className="space-y-4">
          {upcomingEvents.map((event, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded">
                      {event.type}
                    </span>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">
                      {event.format}
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-800 mb-2">{event.title}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />{event.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />{event.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />{event.attendees}
                    </span>
                  </div>
                </div>
                <button className="mt-3 md:mt-0 md:ml-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm">
                  {t("events.register")}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Past */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">{t("events.past")}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {pastEvents.map((event, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
            >
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                {event.type}
              </span>
              <h3 className="font-medium text-gray-800 mt-2 mb-1 text-sm">{event.title}</h3>
              <div className="text-xs text-gray-400">
                {event.date} · {event.location}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Subscribe */}
      <section className="bg-green-50 rounded-xl p-6">
        <div className="text-center">
          <Calendar className="h-10 w-10 text-green-500 mx-auto mb-3" />
          <h2 className="font-semibold text-gray-800 mb-2">{t("events.subscribe")}</h2>
          <p className="text-sm text-gray-500 mb-4">{t("events.subscribeDesc")}</p>
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm">
            {t("events.subscribe")}
          </button>
        </div>
      </section>
    </div>
  );
}
