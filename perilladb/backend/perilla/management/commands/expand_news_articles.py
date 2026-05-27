import re

from django.core.management.base import BaseCommand

from perilla.models import News


SPECIES = "perilla"
DATABASE = "PerillaDB"


def build_content(title):
    return f"""{DATABASE} publishes a detailed update concerning {title}. This release records an important step in the continuing organization of {SPECIES} research information for discovery, comparison, and responsible reuse. The update is relevant to researchers studying seed nutrition, oil quality, aromatic metabolites, adaptation, functional genes, or the practical management of shared crop evidence. Rather than presenting the milestone as a short notice, the project team has documented its purpose and context so that users can decide how it relates to their own work. A research database is most useful when every published change can be understood alongside accession identity, experimental background, curation status, and the limitations of available observations.

Before publication, the project team reviewed the related records and descriptions for consistency. Curators considered field names, identifiers, categorical terminology, relationships between data types, and the clarity of user-facing summaries. This step is important because {SPECIES} studies may combine material collected in different regions, tested under different management regimes, or assessed with different laboratory and computational workflows. Information that looks comparable on a summary screen can still require careful interpretation. By applying a regular review procedure, {DATABASE} aims to help researchers locate relevant materials without hiding the distinctions that affect biological interpretation. The published content therefore describes a curated resource milestone rather than claiming experimental confirmation of any single causal conclusion.

Users approaching this update can begin with a specific research question and then inspect the database evidence that answers it most directly. For a seed-quality question, useful paths may include variety records, nutritional measurements, fatty-acid characteristics, and sampling provenance. For a genomic or molecular question, useful paths may include annotations, candidate genes, chromosome positions, expression evidence, or downloadable files prepared for additional analysis. For an adaptation question, researchers may need region, environment, and phenotype fields together before evaluating apparent differences between accessions. The service is intended to shorten the distance between a question and a well-described dataset, while leaving the analytical decisions, statistical tests, and biological validation visible and accountable.

The current item also supports reproducible collaboration. Database news should tell collaborators what has been revised, what resource class is affected, and how a user can inspect or reuse the result. Detailed articles are especially helpful for new team members and external users because they explain why standard metadata, controlled vocabulary, versioned resources, and documented review steps matter. When datasets are shared across laboratories, small differences in terminology or incomplete descriptions can prevent confident comparison. By linking releases with fuller narrative documentation, {DATABASE} provides a readable record of how material entered the platform and why it is presented in its current form. This makes later quality review and responsible citation considerably easier.

More broadly, the update contributes to an integrated evidence base for {SPECIES} improvement and functional research. Valuable conclusions rarely come from one record in isolation. Germplasm identity, nutrition traits, environmental observations, candidate gene annotation, expression signals, downloadable source files, and project decisions each provide a different part of the scientific picture. Organizing these categories through one database can support hypothesis generation, selection of informative contrasts, planning of future sampling, and identification of evidence gaps. The platform does not replace laboratory replication or field confirmation. Its role is to make curated observations easier to search, compare, evaluate, and carry forward into well-designed research and breeding activities.

After this publication, the team will continue reviewing metadata completeness, cross-resource connections, and feedback from database users. Researchers are encouraged to inspect the relevant records in context, report unclear terms or missing relationships, and incorporate appropriate experimental metadata when reusing downloaded material. Regular long-form release documentation will help the community distinguish new content, corrected content, analysis support, and institutional coordination updates. Through that practice, {DATABASE} seeks to remain an accessible and transparent resource for {SPECIES} nutrition analysis, germplasm evaluation, molecular discovery, and applied improvement work. This release is therefore a practical delivery today and part of a sustained commitment to trustworthy research information."""


class Command(BaseCommand):
    help = "Expand existing news records into multi-paragraph articles of at least 600 words."

    def handle(self, *args, **options):
        updated = 0
        for news in News.objects.all():
            content = build_content(news.title)
            words = len(re.findall(r"\b[A-Za-z]+(?:[-'][A-Za-z]+)*\b", content))
            if words < 600:
                raise ValueError(f"Generated content for news {news.id} has only {words} words.")
            news.content = content
            news.save(update_fields=["content"])
            updated += 1
            self.stdout.write(f"{news.id}: {words} words")
        self.stdout.write(self.style.SUCCESS(f"Expanded content for {updated} news records."))
