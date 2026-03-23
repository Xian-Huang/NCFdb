import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Contact() {
  const { t } = useTranslation();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{t("contact.title")}</h1>
        <p className="text-gray-500">{t("contact.subtitle")}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium text-gray-800 mb-4">{t("contact.form")}</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("contact.name")}</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                placeholder={t("contact.name")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("contact.email")}</label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("contact.subject")}</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                placeholder={t("contact.subject")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("contact.message")}</label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                placeholder={t("contact.message")}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-500 text-white py-2.5 rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
            >
              {t("contact.send")}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-medium text-gray-800 mb-4">{t("contact.info")}</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-800 text-sm">{t("contact.address")}</h3>
                  <p className="text-gray-500 text-sm">Beijing, China</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-800 text-sm">{t("contact.email")}</h3>
                  <p className="text-gray-500 text-sm">contact@perilladb.org</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-800 text-sm">{t("contact.phone")}</h3>
                  <p className="text-gray-500 text-sm">+86 10 1234 5678</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-800 text-sm">{t("contact.website")}</h3>
                  <p className="text-gray-500 text-sm">www.perilladb.org</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-medium text-gray-800 mb-3">{t("contact.collaborators")}</h2>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>• Chinese Academy of Agricultural Sciences</li>
              <li>• National Perilla Improvement Center</li>
              <li>• International Perilla Research Network</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
