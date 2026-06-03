import { useState } from "react";
import { AlertCircle, ArrowLeft, Calendar, CheckCircle2, Clock, Loader2, MapPin, Users, X } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { cropConfig } from "../cropConfig";
import { eventRecords } from "./Events";
import { useTranslation } from "react-i18next";
import { submitEventRegistration } from "../../apis/data_apis";

type FormState = {
  name: string;
  institution: string;
  email: string;
  phone: string;
  attendance_mode: string;
  participant_count: string;
  note: string;
};

const fieldControlClass = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-transparent focus:ring-2";

const initialForm: FormState = {
  name: "",
  institution: "",
  email: "",
  phone: "",
  attendance_mode: "undecided",
  participant_count: "1",
  note: "",
};

export function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const event = eventRecords.find((item) => item.id === id);
  const zhCropName = (cropConfig as typeof cropConfig & { zhCropName?: string }).zhCropName || cropConfig.cropName;
  const zhTraitFocus = (cropConfig as typeof cropConfig & { zhTraitFocus?: string }).zhTraitFocus || cropConfig.traitFocus;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  if (!event) {
    return <div className="mx-auto max-w-4xl px-4 py-12 text-center"><h1 className="text-2xl font-bold text-slate-950">{t("events.notFound")}</h1><Link to="/events" className="mt-4 inline-block" style={{ color: cropConfig.accent }}>{t("events.backList")}</Link></div>;
  }

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setSubmitState("idle");
    setSubmitMessage("");
  };

  const closeModal = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
    setSubmitState("idle");
    setSubmitMessage("");
  };

  const handleSubmit = async (eventSubmit: React.FormEvent<HTMLFormElement>) => {
    eventSubmit.preventDefault();
    setIsSubmitting(true);
    setSubmitState("idle");
    setSubmitMessage("");

    try {
      await submitEventRegistration({
        event_id: event.id,
        event_title: event.title,
        event_date: event.date,
        event_location: event.location,
        name: form.name.trim(),
        institution: form.institution.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        attendance_mode: form.attendance_mode,
        participant_count: Number(form.participant_count) || 1,
        note: form.note.trim(),
      });
      setSubmitState("success");
      setSubmitMessage(t("events.registration.success"));
      setForm(initialForm);
    } catch (error) {
      setSubmitState("error");
      setSubmitMessage(error instanceof Error ? error.message : t("events.registration.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <Link to="/events" className="mb-6 inline-flex items-center text-slate-600 hover:opacity-80"><ArrowLeft className="mr-2 h-4 w-4" />{t("events.backList")}</Link>
      <article className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-xl">
        <section className="relative min-h-[380px] overflow-hidden text-white">
          <img src={event.image} alt={event.title} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-transparent" />
          <div className="relative flex min-h-[380px] flex-col justify-end p-8 md:p-10">
            <div className="mb-4 flex flex-wrap gap-2"><span className="rounded-full bg-white/15 px-3 py-1 text-sm font-semibold backdrop-blur">{event.type}</span><span className="rounded-full bg-white/15 px-3 py-1 text-sm font-semibold backdrop-blur">{event.format}</span></div>
            <h1 className="max-w-4xl text-4xl font-bold leading-tight md:text-5xl">{event.title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/80">{event.description}</p>
          </div>
        </section>
        <section className="grid gap-8 p-6 md:grid-cols-[1fr_320px] md:p-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">{t("events.detailTitle")}</h2>
            <p className="mt-4 text-base leading-8 text-slate-600">{t("events.detailDesc", { crop: zhCropName, trait: zhTraitFocus })}</p>
            <div className="mt-8 rounded-2xl border border-slate-200 p-5" style={{ backgroundColor: cropConfig.accentSoft }}>
              <h3 className="text-lg font-semibold text-slate-950">{t("events.agendaFocus")}</h3>
              <div className="mt-4 space-y-3">
                {event.agenda.map((item, index) => <div key={item} className="flex gap-3 rounded-xl bg-white/80 p-3 text-sm text-slate-700"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white" style={{ backgroundColor: cropConfig.accent }}>{index + 1}</span><span>{item}</span></div>)}
              </div>
            </div>
          </div>
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">{t("events.infoTitle")}</h2>
            <div className="mt-5 space-y-4 text-sm text-slate-600">
              <Info icon={<Calendar className="h-4 w-4" />} label={t("events.date")} value={event.date} />
              <Info icon={<Clock className="h-4 w-4" />} label={t("events.time")} value={event.time} />
              <Info icon={<MapPin className="h-4 w-4" />} label={t("events.location")} value={event.location} />
              <Info icon={<Users className="h-4 w-4" />} label={t("events.attendees")} value={event.attendees} />
            </div>
            <button type="button" onClick={() => setIsModalOpen(true)} className="mt-6 w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ backgroundColor: cropConfig.accent }}>{t("events.registerInterest")}</button>
          </aside>
        </section>
      </article>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 p-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">{t("events.registration.title")}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{event.title}</p>
              </div>
              <button type="button" onClick={closeModal} className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900" aria-label={t("events.registration.close")}><X className="h-5 w-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t("events.registration.name")} required><input required value={form.name} onChange={(e) => updateField("name", e.target.value)} className={fieldControlClass} style={{ "--tw-ring-color": cropConfig.accent } as React.CSSProperties} /></Field>
                <Field label={t("events.registration.institution")} required><input required value={form.institution} onChange={(e) => updateField("institution", e.target.value)} className={fieldControlClass} style={{ "--tw-ring-color": cropConfig.accent } as React.CSSProperties} /></Field>
                <Field label={t("events.registration.email")} required><input required type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} className={fieldControlClass} style={{ "--tw-ring-color": cropConfig.accent } as React.CSSProperties} /></Field>
                <Field label={t("events.registration.phone")}><input value={form.phone} onChange={(e) => updateField("phone", e.target.value)} className={fieldControlClass} style={{ "--tw-ring-color": cropConfig.accent } as React.CSSProperties} /></Field>
                <Field label={t("events.registration.mode")} required>
                  <select required value={form.attendance_mode} onChange={(e) => updateField("attendance_mode", e.target.value)} className={fieldControlClass} style={{ "--tw-ring-color": cropConfig.accent } as React.CSSProperties}>
                    <option value="undecided">{t("events.registration.modeUndecided")}</option>
                    <option value="online">{t("events.registration.modeOnline")}</option>
                    <option value="offline">{t("events.registration.modeOffline")}</option>
                  </select>
                </Field>
                <Field label={t("events.registration.count")} required><input required min={1} max={20} type="number" value={form.participant_count} onChange={(e) => updateField("participant_count", e.target.value)} className={fieldControlClass} style={{ "--tw-ring-color": cropConfig.accent } as React.CSSProperties} /></Field>
              </div>
              <Field label={t("events.registration.note")}><textarea rows={4} value={form.note} onChange={(e) => updateField("note", e.target.value)} className={`${fieldControlClass} resize-none`} style={{ "--tw-ring-color": cropConfig.accent } as React.CSSProperties} /></Field>

              {submitState !== "idle" && (
                <div className={`flex gap-2 rounded-xl px-4 py-3 text-sm ${submitState === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                  {submitState === "success" ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
                  <span>{submitMessage}</span>
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                <button type="button" onClick={closeModal} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">{t("events.registration.cancel")}</button>
                <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70" style={{ backgroundColor: cropConfig.accent }}>
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {t("events.registration.submit")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="flex gap-3"><div style={{ color: cropConfig.accent }}>{icon}</div><div><div className="font-medium text-slate-950">{label}</div><div className="mt-1">{value}</div></div></div>;
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-slate-700"><span>{label}{required && <span className="ml-1 text-red-500">*</span>}</span><div className="mt-2">{children}</div></label>;
}


