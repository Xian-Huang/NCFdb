import { Calendar, MapPin, Clock, Users, Video } from "lucide-react";

export function Events() {
  const upcomingEvents = [
    {
      title: "International Sesame Genomics Symposium 2026",
      date: "July 20-23, 2026",
      time: "9:00 AM - 5:00 PM",
      location: "Beijing, China",
      type: "Conference",
      attendees: "300+",
      format: "Hybrid",
      description: "Join researchers from around the world for the premier conference on sesame genomics. Topics include genome assembly, population genetics, trait mapping, and breeding applications.",
    },
    {
      title: "Bioinformatics Workshop: Sesame Genome Analysis",
      date: "April 15, 2026",
      time: "2:00 PM - 5:00 PM",
      location: "Online",
      type: "Workshop",
      attendees: "150+",
      format: "Virtual",
      description: "Learn how to effectively use our genome browser and analysis tools for sesame research. This hands-on workshop covers data visualization, gene annotation, and comparative genomics.",
    },
    {
      title: "Sesame Breeding Innovation Forum",
      date: "May 10, 2026",
      time: "10:00 AM - 12:00 PM",
      location: "Online",
      type: "Webinar",
      attendees: "200+",
      format: "Virtual",
      description: "Discover the latest developments in sesame breeding research. Experts will present findings and discuss applications for improving sesame yield and quality.",
    },
    {
      title: "Field Day: Sesame Diversity Collection",
      date: "September 5, 2026",
      time: "8:00 AM - 3:00 PM",
      location: "Agricultural Research Station, Henan Province",
      type: "Field Day",
      attendees: "100+",
      format: "In-person",
      description: "Visit experimental plots and see firsthand how genomic resources are being applied to sesame breeding. Tours, demonstrations, and networking opportunities.",
    },
  ];

  const pastEvents = [
    {
      title: "Sesame Genome Consortium Meeting 2025",
      date: "December 10-12, 2025",
      location: "Shanghai, China",
      type: "Conference",
      recording: true,
    },
    {
      title: "High-Throughput Phenotyping Workshop",
      date: "November 8, 2025",
      location: "Online",
      type: "Workshop",
      recording: true,
    },
    {
      title: "Database Launch & Training Webinar",
      date: "October 20, 2025",
      location: "Online",
      type: "Webinar",
      recording: true,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Events & Workshops</h1>
        <p className="text-lg text-gray-600">
          Connect with the sesame genomics community through conferences, workshops, and webinars
        </p>
      </div>

      {/* Upcoming Events */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Upcoming Events</h2>
        <div className="space-y-6">
          {upcomingEvents.map((event, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {event.type}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {event.format}
                    </span>
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">{event.title}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-5 w-5 mr-2 text-green-500" />
                      {event.date}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-5 w-5 mr-2 text-green-500" />
                      {event.time}
                    </div>
                    <div className="flex items-center text-gray-600">
                      {event.format === "Virtual" ? (
                        <Video className="h-5 w-5 mr-2 text-green-500" />
                      ) : (
                        <MapPin className="h-5 w-5 mr-2 text-green-500" />
                      )}
                      {event.location}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="h-5 w-5 mr-2 text-green-500" />
                      {event.attendees} expected attendees
                    </div>
                  </div>
                  <p className="text-gray-600">{event.description}</p>
                </div>
                <button className="mt-4 md:mt-0 md:ml-6 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors whitespace-nowrap">
                  Register Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Past Events */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Past Events</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastEvents.map((event, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                {event.type}
              </span>
              <h3 className="text-lg font-semibold mt-3 mb-2">{event.title}</h3>
              <div className="flex items-center text-gray-600 text-sm mb-2">
                <Calendar className="h-4 w-4 mr-2" />
                {event.date}
              </div>
              <div className="flex items-center text-gray-600 text-sm mb-4">
                <MapPin className="h-4 w-4 mr-2" />
                {event.location}
              </div>
              {event.recording && (
                <button className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center">
                  <Video className="h-4 w-4 mr-1" />
                  Watch Recording
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Event Calendar */}
      <section className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-8">
        <div className="text-center">
          <Calendar className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-4">Stay Updated</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Subscribe to our event calendar to receive notifications about upcoming workshops, webinars, and conferences
          </p>
          <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            Subscribe to Calendar
          </button>
        </div>
      </section>
    </div>
  );
}
