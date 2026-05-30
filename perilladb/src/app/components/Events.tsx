import { ArrowRight, Calendar, Clock, MapPin, Users, Video } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cropConfig } from "../cropConfig";

const zhCropName = (cropConfig as typeof cropConfig & { zhCropName?: string }).zhCropName || cropConfig.cropName;
const zhTraitFocus = (cropConfig as typeof cropConfig & { zhTraitFocus?: string }).zhTraitFocus || cropConfig.traitFocus;

export const eventRecords = [
  {
    id: "annual-symposium-2026",
    title: `2026 ${zhCropName}功能成分与基因组学研讨会`,
    date: "2026年6月15日-18日",
    time: "09:00 - 17:00",
    location: "区域试验网络与线上会场",
    type: "学术会议",
    attendees: "250+",
    format: "线上线下结合",
    image: cropConfig.pageImages.events,
    description: `会议围绕${zhTraitFocus}、区域种质资源、数据库整理和育种应用展开，展示数据库建设进展与共享数据规范。`,
    agenda: ["作物基因组与功能成分资源专题报告", "区域特征营养数据整理与质量控制圆桌讨论", "数据库检索、地图和营养矩阵实操演示"],
  },
  {
    id: "database-workshop-2026",
    title: `${cropConfig.dbName} 数据整理与入库培训`,
    date: "2026年7月22日",
    time: "14:00 - 17:30",
    location: "线上培训室",
    type: "培训",
    attendees: "120+",
    format: "线上",
    image: cropConfig.pageImages.tools,
    description: `面向数据管理员和课题组成员，讲解批量元数据上传、证据标签、下载文件准备和可视化结果检查流程。`,
    agenda: ["种质、组学和营养记录模板准备", "新闻、活动和版本内容发布流程", "数据导出、API 和可视化检查"],
  },
  {
    id: "field-day-2026",
    title: `${zhCropName}区域试验现场观摩`,
    date: "2026年8月9日",
    time: "08:30 - 15:00",
    location: "区域试验基地",
    type: "现场观摩",
    attendees: "80+",
    format: "线下",
    image: cropConfig.heroImage,
    description: `围绕代表性种质材料开展田间观察、样品登记、性状评分和环境因子记录，支撑区域优势品种比较。`,
    agenda: ["田间小区观察与表型评分", "籽粒品质与功能成分取样流程", "试验负责人讨论区域适应性评价"],
  },
  {
    id: "omics-webinar-2026",
    title: `${zhCropName}多组学数据解读网络报告`,
    date: "2026年9月3日",
    time: "10:30 - 12:00",
    location: "线上",
    type: "网络报告",
    attendees: "200+",
    format: "线上",
    image: cropConfig.pageImages.research,
    description: `聚焦表达热图、候选基因网络、营养性状表格和后续分子指纹数据接入的分析流程。`,
    agenda: ["表达图谱和候选基因解读", "区域营养性状与环境因子联动分析", "跨表证据导出与结果复核"],
  },
];

const pastEvents = [
  { title: `${cropConfig.dbName} 数据发布评审会`, date: "2025年11月12日-14日", location: "线上", type: "联盟会议", recording: true },
  { title: `${zhCropName}营养性状整理培训`, date: "2025年10月5日", location: "区域试验网络", type: "培训", recording: true },
  { title: "数据库上线说明会", date: "2025年9月15日", location: "线上", type: "网络报告", recording: true },
];

export function Events() {
  const { t } = useTranslation();

  return (
    <div className="relative">
      <div className="mx-auto max-w-7xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[1.75rem] p-8 text-white shadow-xl" style={{ backgroundImage: `linear-gradient(90deg, rgba(15,23,42,.82), rgba(15,23,42,.36)), url(${cropConfig.pageImages.events})`, backgroundSize: "cover", backgroundPosition: "center" }}>
          <div className="relative max-w-4xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur"><Calendar className="h-4 w-4" />{t("events.heroBadge")}</div>
            <h1 className="mb-4 text-4xl font-bold">{t("events.title")}</h1>
            <p className="max-w-3xl text-lg text-white/85">{t("events.subtitle")}</p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75">{t("events.heroDesc")}</p>
          </div>
        </section>


        <section className="grid gap-8 border-l-4 py-2 pl-6 lg:grid-cols-3" style={{ borderColor: cropConfig.accent }}>
          <div className="lg:col-span-2">
            <p className="text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: cropConfig.accent }}>{t("events.scopeEyebrow")}</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">{t("events.scopeTitle")}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {t("events.scopeDesc")}
            </p>
          </div>
          <div className="border-y border-slate-200 py-6 text-slate-900">
            <h3 className="text-xl font-semibold">{t("events.standingTopics")}</h3>
            <div className="mt-5 divide-y divide-slate-200 text-sm text-slate-700">
              {[t("events.topics.sampling"), t("events.topics.curation"), t("events.topics.omics"), t("events.topics.release")].map((item) => <div key={item} className="py-3">{item}</div>)}
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
                  <span className="flex items-center gap-2">{event.format === "线上" ? <Video className="h-4 w-4" style={{ color: cropConfig.accent }} /> : <MapPin className="h-4 w-4" style={{ color: cropConfig.accent }} />}{event.location}</span>
                  <span className="flex items-center gap-2"><Users className="h-4 w-4" style={{ color: cropConfig.accent }} />{event.attendees}</span>
                </div>
                <Link to={`/events/${event.id}`} className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ backgroundColor: cropConfig.accent }}>{t("common.details")} <ArrowRight className="h-4 w-4" /></Link>
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
                {event.recording && <button className="mt-4 inline-flex items-center text-sm font-medium" style={{ color: cropConfig.accent }}><Video className="mr-1 h-4 w-4" />{t("common.replay")}</button>}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
