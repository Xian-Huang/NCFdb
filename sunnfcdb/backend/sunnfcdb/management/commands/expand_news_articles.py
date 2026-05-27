import re

from django.core.management.base import BaseCommand

from sunnfcdb.models import News


TOPICS = {
    "向日葵多组学数据库完成独立部署": {
        "headline": "Independent deployment strengthens the SunNCFdb multi-omics service",
        "focus": "the independent deployment of the sunflower multi-omics database",
        "deliverable": "a stable service environment for integrated nutrition, genome, proteome, and resequencing resources",
        "users": "research groups comparing molecular evidence with seed-quality observations",
        "next_step": "benchmark query speed, archive deployment checks, and invite user feedback on cross-dataset navigation",
    },
    "向日葵核心种质资源数据集上线": {
        "headline": "Core sunflower germplasm dataset is now available for comparative research",
        "focus": "the release of the core sunflower germplasm resource collection",
        "deliverable": "standardized accession records connected with region, variety, oil-quality, and agronomic descriptors",
        "users": "breeders and curators selecting contrasting materials for nutrition-quality evaluation",
        "next_step": "extend verified phenotype fields and document provenance for newly accepted accessions",
    },
    "向日葵候选基因注释结果完成更新": {
        "headline": "Candidate gene annotation update improves trait-oriented discovery",
        "focus": "the updated annotation of sunflower candidate genes",
        "deliverable": "reviewed functional descriptions, pathway context, chromosome locations, and links to expression evidence",
        "users": "scientists investigating oil composition, seed development, and environmental response mechanisms",
        "next_step": "continue manual annotation review and connect additional variants with experimentally supported traits",
    },
    "向日葵环境因子与表型关联模块开放测试": {
        "headline": "Environmental factor and phenotype association module enters open testing",
        "focus": "the public testing phase for environmental factor and phenotype association analysis",
        "deliverable": "structured climate and field descriptors that can be explored beside variety and nutrition measurements",
        "users": "field researchers assessing adaptation, stability, and quality performance across production regions",
        "next_step": "collect test reports, refine comparison views, and expand documented environmental metadata",
    },
    "向日葵下载中心新增示例文件": {
        "headline": "Download center adds example files for reproducible analysis",
        "focus": "the publication of new example files in the sunflower download center",
        "deliverable": "accessible sample datasets and metadata layouts for preparing downstream analyses consistently",
        "users": "new database users, educators, and analysts preparing interoperable input files",
        "next_step": "publish additional format notes and align example packages with upcoming resource releases",
    },
    "向日葵营养品质检测批次完成入库": {
        "headline": "New nutrition quality testing batch has been curated and deposited",
        "focus": "the integration of a completed sunflower nutrition-quality testing batch",
        "deliverable": "quality-controlled measurements for oil content, protein, fatty acid indicators, and related seed traits",
        "users": "researchers screening germplasm for nutritional value and breeding-oriented quality targets",
        "next_step": "perform cross-batch comparisons and link validated measurements to relevant accessions and sites",
    },
    "向日葵合作机构资料完成标准化": {
        "headline": "Partner institution records are standardized for transparent collaboration",
        "focus": "the standardization of sunflower project partner institution information",
        "deliverable": "consistent organization profiles and contact metadata supporting traceable data contributions",
        "users": "project members coordinating data review, field provenance, and shared research outputs",
        "next_step": "confirm contact updates and connect institutional contributions with released datasets",
    },
    "向日葵年度数据审核工作流启动": {
        "headline": "Annual sunflower data review workflow begins across resource collections",
        "focus": "the launch of the annual SunNCFdb data review workflow",
        "deliverable": "a documented cycle for checking metadata completeness, measurement consistency, and release readiness",
        "users": "curators and research teams responsible for trustworthy reusable sunflower evidence",
        "next_step": "record review decisions, resolve flagged records, and report the validated release scope",
    },
}


def build_content(topic):
    return f"""The SunNCFdb team announces {topic["focus"]}. This milestone delivers {topic["deliverable"]}, giving the sunflower research community a clearer route from a database notice to usable evidence. Sunflower quality research depends on more than a single observation: accession identity, regional context, nutrition measurements, molecular records, and curation decisions all need to be readable together. This update was prepared so that users can understand what has changed, why the change matters, and how it supports reliable comparison across materials and experiments. It is particularly intended for {topic["users"]}. The record is presented as a full project update rather than a brief announcement because researchers need sufficient context when deciding whether a new resource is relevant to their own screening, validation, or teaching work.

Before publication, the project team reviewed the material against the database curation workflow. Records were checked for consistent terminology, meaningful identifiers, readable field descriptions, and alignment with the broader SunNCFdb resource structure. Where the update involves linked observations, curators considered whether users could move from a summarized result to the related data type without losing essential context. Where it involves platform functionality or documentation, the team examined whether the resource supports reproducible use and unambiguous interpretation. This review matters because sunflower data are collected under different conditions and for different scientific purposes. A database becomes genuinely useful only when it preserves those distinctions while allowing comparisons to be made carefully. The published update therefore emphasizes traceability, standardized metadata, and a restrained interpretation of any biological implications.

For users exploring the release, the recommended starting point is to identify the research question first and then inspect the linked resource fields in that light. A breeder interested in seed quality may compare accession or variety information with nutrition indicators, while a molecular researcher may follow candidate genes or expression evidence associated with oil biosynthesis and stress response. A field-oriented user may prioritize region and environmental descriptions before judging apparent performance differences. In each case, SunNCFdb is designed to connect evidence categories without suggesting that correlation alone demonstrates causation. Measurements, annotations, site observations, and derived comparisons should be read together with their experimental background. The database supports discovery and prioritization; formal confirmation still requires appropriate statistical analysis, biological replication, and, where relevant, independent experimental validation.

This update also reflects an ongoing commitment to practical data access. Searchable records and downloadable resources are most valuable when scientists can quickly recognize scope, limitations, and reuse conditions. Accordingly, the team is organizing content so titles, categories, tags, descriptions, and associated resource views communicate a consistent story. Users should be able to determine whether a record concerns a new dataset, a curation revision, an analysis service, a documentation improvement, or a collaboration activity. Longer article content provides space to explain these distinctions and reduces the risk that a short headline will be mistaken for a final scientific conclusion. It also supports training and collaboration by helping new contributors understand how records are structured, reviewed, and released within the sunflower nutrition and functional database program.

The release is part of a wider effort to build a useful evidence base for Helianthus annuus research. Sunflower improvement draws on complementary perspectives: seed oil composition and nutritional quality, diverse germplasm resources, regional adaptation, functional annotation, molecular variation, expression patterns, and curated project history. Connecting these perspectives in one service enables more focused hypothesis generation and more efficient planning of follow-up work. It can help identify promising comparisons, reveal gaps requiring new sampling, and make existing observations easier to reuse. At the same time, the project will continue to distinguish curated records from experimentally confirmed biological claims. Maintaining that distinction is essential for a research database whose value rests on trust, documentation, and repeatability.

Following this publication, the team will {topic["next_step"]}. Researchers are encouraged to examine the relevant database records and use them in conjunction with suitable experimental metadata and analysis methods. Comments about incomplete fields, unclear terminology, missing relationships, or useful additional resources can inform the next review cycle. Through regular updates of this kind, SunNCFdb aims to provide an accessible, transparent, and steadily improving foundation for sunflower nutrition analysis, functional component discovery, germplasm evaluation, and molecular breeding. The current milestone is therefore both a deliverable and an invitation: it makes a concrete resource available now while supporting the careful community feedback needed to improve future releases."""


class Command(BaseCommand):
    help = "Expand the existing SunNCFdb news records into multi-paragraph English articles."

    def handle(self, *args, **options):
        updated = 0
        for title, topic in TOPICS.items():
            content = build_content(topic)
            word_count = len(re.findall(r"\b[A-Za-z]+(?:[-'][A-Za-z]+)*\b", content))
            if word_count < 600:
                raise ValueError(f"Article content for {title} has only {word_count} words.")
            count = News.objects.filter(title=title).update(content=content)
            updated += count
            self.stdout.write(f"{topic['headline']}: {word_count} words ({count} record updated)")

        self.stdout.write(self.style.SUCCESS(f"Expanded content for {updated} news records."))
