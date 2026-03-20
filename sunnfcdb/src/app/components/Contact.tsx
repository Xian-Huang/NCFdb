import { Mail, MapPin, Phone, Send } from "lucide-react";

export function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg text-gray-600">
          Get in touch with our team for questions, collaborations, or technical support
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
          <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                placeholder="your.email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Institution / Organization
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                placeholder="Your institution"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none">
                <option>General Inquiry</option>
                <option>Data Access</option>
                <option>Technical Support</option>
                <option>Collaboration</option>
                <option>Data Submission</option>
                <option>Bug Report</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                placeholder="Please describe your inquiry..."
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
            >
              <Send className="h-5 w-5 mr-2" />
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="h-6 w-6 text-amber-500 mr-3 mt-1" />
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-gray-600">sunflower@example.com</div>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="h-6 w-6 text-amber-500 mr-3 mt-1" />
                <div>
                  <div className="font-medium">Phone</div>
                  <div className="text-gray-600">+86-371-65720774 (China)</div>
                  <div className="text-sm text-gray-500">Monday - Friday, 9:00 AM - 5:00 PM (China Standard Time)</div>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-amber-500 mr-3 mt-1" />
                <div>
                  <div className="font-medium">Address</div>
                  <div className="text-gray-600">
                  Specialty Oil Crops R&D Center<br />
                  National Specialty Oil Crops Industry Technology System<br />
                  Henan Sesame Research Center<br />
                  Henan Academy of Agricultural Sciences<br />
                  #116 HuayuanRoad, Zhengzhou, Henan, China<br />
                  450002
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Project Leadership</h2>
            <div className="space-y-4">
              <div>
                <div className="font-medium">Principal Investigator</div>
                <div className="text-gray-600">Dr. Hongmei Miao</div>
              </div>
              <div>
                <div className="font-medium">Technical Support</div>
                <div className="text-gray-600">Dr. Hengchun Cao</div>
              </div>
            </div>
          </div>

          {/* Collaboration */}
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg p-6 text-white">
            <h2 className="text-xl font-semibold mb-3">Interested in Collaboration?</h2>
            <p className="mb-4">
              We welcome collaborations with research institutions, breeding companies, and individual researchers
            </p>
            <button className="px-4 py-2 bg-white text-amber-600 rounded hover:bg-gray-100 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-12 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="bg-white p-4 rounded-lg border border-gray-200">
            <summary className="font-medium cursor-pointer">
              How can I download genomic data?
            </summary>
            <p className="mt-2 text-gray-600">
              Visit our Data page to browse and download available datasets. All data is freely available for research purposes.
            </p>
          </details>
          <details className="bg-white p-4 rounded-lg border border-gray-200">
            <summary className="font-medium cursor-pointer">
              Can I submit my own data to the database?
            </summary>
            <p className="mt-2 text-gray-600">
              Yes! We encourage researchers to submit their sunflower genomic data. Please contact us at submission@sunflowergenome.org for guidelines.
            </p>
          </details>
          <details className="bg-white p-4 rounded-lg border border-gray-200">
            <summary className="font-medium cursor-pointer">
              How do I cite the database in my publication?
            </summary>
            <p className="mt-2 text-gray-600">
              Please cite our main publication: Chen et al. (2025) "Sunflower Genome Database: A comprehensive resource for genomic research" in Plant Journal.
            </p>
          </details>
          <details className="bg-white p-4 rounded-lg border border-gray-200">
            <summary className="font-medium cursor-pointer">
              Is there an API for programmatic access?
            </summary>
            <p className="mt-2 text-gray-600">
              Yes, we provide a REST API for programmatic access to our data. Visit the Tools page and check the API Access section for documentation.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}
