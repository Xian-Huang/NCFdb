import { Mail, Phone, MapPin, Globe } from "lucide-react";

export function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Have questions about sesame genomics data? We'd love to hear from you!
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="How can we help?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Your message..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              Send Message
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-green-500 mr-4 mt-1" />
                <div>
                  <h3 className="font-semibold">Address</h3>
                  <p className="text-gray-600">123 Sesame Research Lane<br />Beijing, China 100083</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="h-6 w-6 text-green-500 mr-4 mt-1" />
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-gray-600">contact@sesamedb.org</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="h-6 w-6 text-green-500 mr-4 mt-1" />
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p className="text-gray-600">+86 10 1234 5678</p>
                </div>
              </div>
              <div className="flex items-start">
                <Globe className="h-6 w-6 text-green-500 mr-4 mt-1" />
                <div>
                  <h3 className="font-semibold">Website</h3>
                  <p className="text-gray-600">www.sesamedb.org</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Collaborating Institutions</h2>
            <ul className="space-y-2 text-gray-600">
              <li>• Chinese Academy of Agricultural Sciences</li>
              <li>• Institute of Crop Sciences</li>
              <li>• National Sesame Improvement Center</li>
              <li>• International Sesame Research Network</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
