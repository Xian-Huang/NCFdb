import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cropConfig } from "../cropConfig";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/users/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token || "session");
        navigate("/admin");
      } else {
        setError(data.error || t("login.invalid"));
      }
    } catch (err) {
      setError(t("login.failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{
        background: `linear-gradient(135deg, ${cropConfig.accentSoft} 0%, #ffffff 48%, #fef3c7 100%)`,
        ["--login-accent" as string]: cropConfig.accent,
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: cropConfig.accentSoft }}>
            <Shield className="h-8 w-8" style={{ color: cropConfig.accentDark }} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{t("login.title")}</h1>
          <p className="text-gray-500 mt-2">{t("login.subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("login.username")}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-[var(--login-accent)]"
              placeholder={t("login.usernamePlaceholder")}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("login.password")}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 focus:border-transparent focus:ring-2 focus:ring-[var(--login-accent)]"
                placeholder={t("login.passwordPlaceholder")}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg py-3 font-medium text-white transition-all hover:opacity-90 focus:ring-4 focus:ring-amber-200 disabled:cursor-not-allowed disabled:opacity-50"
            style={{ backgroundColor: cropConfig.accent }}
          >
            {loading ? t("login.signingIn") : t("login.signIn")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/" className="text-sm hover:opacity-80" style={{ color: cropConfig.accentDark }}>
            {t("common.backHome")}
          </a>
        </div>
      </div>
    </div>
  );
}

