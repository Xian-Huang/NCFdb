import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { cropConfig } from "../cropConfig";

export function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <h1 className="mb-4 text-6xl font-bold" style={{ color: cropConfig.accent }}>404</h1>
      <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-8">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="inline-flex items-center rounded-lg px-6 py-3 text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: cropConfig.accent }}
      >
        <Home className="h-5 w-5 mr-2" />
        Back to Home
      </Link>
    </div>
  );
}

