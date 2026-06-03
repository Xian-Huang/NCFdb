from datetime import date
from decimal import Decimal
import json

from django.core.management.base import BaseCommand
from django.db import transaction

from sunnfcdb.models import (
    GeneticDiversityAnalysis,
    GermplasmResource,
    MarkerLocus,
    MolecularFingerprint,
    SequencingData,
    Variety,
)


MARKERS = [
    {
        "marker_id": "HA-SSR-001",
        "marker_name": "ORS-297",
        "marker_type": "SSR",
        "chromosome": "Ha01",
        "position": 1845200,
        "forward_primer": "AGGCTTCATGTTCTTCTTGC",
        "reverse_primer": "TCCATGCTTCTCTTCTTGGA",
        "expected_size": "142-168 bp",
        "reference_allele": "A142",
        "alternate_allele": "A156/A168",
        "annotated_gene": "HanXRQChr01g0039211",
        "associated_trait": "种皮颜色 / 籽粒大小",
        "polymorphism_rate": Decimal("72.40"),
        "pic": Decimal("0.612"),
        "notes": "核心 SSR 标记，用于品种身份识别。",
    },
    {
        "marker_id": "HA-SSR-002",
        "marker_name": "ORS-1036",
        "marker_type": "SSR",
        "chromosome": "Ha03",
        "position": 9264100,
        "forward_primer": "CTTGATGAGGAGGAGGAGGA",
        "reverse_primer": "ACACACGTTGTTGTTGTTGC",
        "expected_size": "188-214 bp",
        "reference_allele": "A188",
        "alternate_allele": "A202/A214",
        "annotated_gene": "HanXRQChr03g0098121",
        "associated_trait": "含油率稳定性",
        "polymorphism_rate": Decimal("68.20"),
        "pic": Decimal("0.584"),
        "notes": "适合高油材料的多态性筛查。",
    },
    {
        "marker_id": "HA-SNP-001",
        "marker_name": "Oleic-HaFAD2-1",
        "marker_type": "SNP",
        "chromosome": "Ha14",
        "position": 37852012,
        "reference_allele": "C",
        "alternate_allele": "T",
        "annotated_gene": "HaFAD2-1",
        "associated_trait": "油酸含量",
        "polymorphism_rate": Decimal("54.80"),
        "pic": Decimal("0.431"),
        "notes": "脂肪酸组成相关候选 SNP。",
    },
    {
        "marker_id": "HA-SNP-002",
        "marker_name": "Drought-HaDREB2",
        "marker_type": "SNP",
        "chromosome": "Ha10",
        "position": 21400876,
        "reference_allele": "G",
        "alternate_allele": "A",
        "annotated_gene": "HaDREB2",
        "associated_trait": "抗旱性",
        "polymorphism_rate": Decimal("61.30"),
        "pic": Decimal("0.502"),
        "notes": "干旱胁迫响应候选位点。",
    },
    {
        "marker_id": "HA-INDEL-001",
        "marker_name": "Rust-R13-InDel",
        "marker_type": "INDEL",
        "chromosome": "Ha13",
        "position": 10533190,
        "expected_size": "126/138 bp",
        "reference_allele": "DEL12",
        "alternate_allele": "INS12",
        "annotated_gene": "HanXRQChr13g0412051",
        "associated_trait": "锈病抗性",
        "polymorphism_rate": Decimal("47.90"),
        "pic": Decimal("0.376"),
        "notes": "抗病材料辅助鉴定标记。",
    },
    {
        "marker_id": "HA-INDEL-002",
        "marker_name": "Branch-BR2-InDel",
        "marker_type": "INDEL",
        "chromosome": "Ha07",
        "position": 18876021,
        "expected_size": "204/220 bp",
        "reference_allele": "INS16",
        "alternate_allele": "DEL16",
        "annotated_gene": "HanXRQChr07g0221901",
        "associated_trait": "分枝性",
        "polymorphism_rate": Decimal("51.70"),
        "pic": Decimal("0.408"),
        "notes": "株型与分枝表型相关标记。",
    },
    {
        "marker_id": "HA-KASP-001",
        "marker_name": "HullColor-KASP",
        "marker_type": "KASP",
        "chromosome": "Ha16",
        "position": 29901844,
        "reference_allele": "A",
        "alternate_allele": "G",
        "annotated_gene": "HanXRQChr16g0520127",
        "associated_trait": "种皮颜色",
        "polymorphism_rate": Decimal("63.60"),
        "pic": Decimal("0.527"),
        "notes": "KASP 分型，适用于批量检测。",
    },
    {
        "marker_id": "HA-KASP-002",
        "marker_name": "EarlyFlower-KASP",
        "marker_type": "KASP",
        "chromosome": "Ha05",
        "position": 15673912,
        "reference_allele": "T",
        "alternate_allele": "C",
        "annotated_gene": "HaFT4",
        "associated_trait": "开花期 / 熟期",
        "polymorphism_rate": Decimal("59.10"),
        "pic": Decimal("0.489"),
        "notes": "早熟材料辅助选择标记。",
    },
]


def decimal_value(base, index, step, places="0.01"):
    return (Decimal(base) + Decimal(index) * Decimal(step)).quantize(Decimal(places))


class Command(BaseCommand):
    help = "Seed sunflower molecular fingerprint and germplasm resource data."

    def handle(self, *args, **options):
        varieties = list(Variety.objects.select_related("region").order_by("id"))
        if not varieties:
            self.stderr.write(self.style.ERROR("No varieties found. Seed varieties before molecular data."))
            return

        with transaction.atomic():
            marker_objects = self.seed_markers()
            germplasm_count = self.seed_germplasm(varieties)
            fingerprint_count = self.seed_fingerprints(varieties, marker_objects)
            sequencing_count = self.seed_sequencing(varieties)
            diversity_count = self.seed_diversity(varieties, marker_objects)

        self.stdout.write(self.style.SUCCESS(
            "Seeded molecular data: "
            f"{len(marker_objects)} marker loci, "
            f"{fingerprint_count} fingerprints, "
            f"{germplasm_count} germplasm resources, "
            f"{sequencing_count} sequencing records, "
            f"{diversity_count} diversity analyses."
        ))

    def seed_markers(self):
        markers = []
        for row in MARKERS:
            marker, _ = MarkerLocus.objects.update_or_create(
                marker_id=row["marker_id"],
                defaults=row,
            )
            markers.append(marker)
        return markers

    def seed_germplasm(self, varieties):
        types = ["cultivar", "breeding_line", "landrace", "cultivar", "mutant"]
        drought = ["high", "medium", "medium", "low", "high"]
        disease = ["锈病中抗，菌核病中抗", "锈病高抗，霜霉病中抗", "菌核病中抗", "锈病感病，适宜高油筛选", "霜霉病高抗"]
        count = 0
        for index, variety in enumerate(varieties, start=1):
            region_name = variety.region.name if variety.region else "核心种质圃"
            GermplasmResource.objects.update_or_create(
                variety=variety,
                defaults={
                    "germplasm_number": f"SUN-GR-{index:04d}",
                    "germplasm_type": types[index % len(types)],
                    "collection_site": region_name,
                    "collection_year": 2014 + (index % 10),
                    "donor_institution": "SunNFCDB 向日葵种质资源协作组",
                    "ploidy": "2x",
                    "genome_size": "3.5 Gb",
                    "chromosome_number": 34,
                    "plant_height": decimal_value("135.00", index % 16, "3.20"),
                    "branch_number": 0 if index % 4 else 2 + index % 5,
                    "capsule_number": 1 if index % 4 else 3 + index % 6,
                    "seeds_per_capsule": 620 + (index * 23) % 240,
                    "thousand_seed_weight": decimal_value("48.00", index % 14, "1.35"),
                    "seed_coat_color": variety.seed_color or "条纹",
                    "flower_color": "黄色",
                    "stem_color": "绿色",
                    "disease_resistance": disease[index % len(disease)],
                    "drought_resistance": drought[index % len(drought)],
                    "fingerprint_profile": f"{variety.variety_code}: 8 个核心标记位点已完成分型。",
                    "has_molecular_data": True,
                    "has_sequencing_data": index <= 10,
                    "notes": "示例种质资源数据，可通过后台或批量导入继续维护。",
                },
            )
            count += 1
        return count

    def seed_fingerprints(self, varieties, markers):
        allele_pairs = [
            ("A142", "A156", "H"),
            ("A188", "A202", "H"),
            ("C", "T", "CT"),
            ("G", "G", "GG"),
            ("DEL12", "INS12", "DI"),
            ("INS16", "INS16", "II"),
            ("A", "G", "AG"),
            ("T", "C", "TC"),
        ]
        count = 0
        for variety_index, variety in enumerate(varieties):
            for marker_index, marker in enumerate(markers):
                a1, a2, code = allele_pairs[marker_index % len(allele_pairs)]
                if (variety_index + marker_index) % 3 == 0:
                    a2 = a1
                    code = f"{a1}/{a1}"
                elif (variety_index + marker_index) % 4 == 0:
                    code = f"{a1}/{a2}"
                MolecularFingerprint.objects.update_or_create(
                    variety=variety,
                    marker=marker,
                    defaults={
                        "allele1": a1,
                        "allele2": a2,
                        "genotype_code": code,
                        "fragment_size": self.fragment_size(marker, variety_index, marker_index),
                        "quality_score": 88 + ((variety_index + marker_index) % 12),
                        "notes": "核心指纹矩阵示例记录。",
                    },
                )
                count += 1
        return count

    def fragment_size(self, marker, variety_index, marker_index):
        if marker.marker_type in {"SNP", "KASP"}:
            return None
        base = 140 + marker_index * 11
        return f"{base + (variety_index % 5) * 4} bp"

    def seed_sequencing(self, varieties):
        platforms = ["Illumina NovaSeq 6000", "MGISEQ-2000", "PacBio Sequel II", "Oxford Nanopore PromethION"]
        data_types = ["WGS", "RNA-seq", "GBS", "RAD-seq"]
        count = 0
        for index, variety in enumerate(varieties[:10], start=1):
            SequencingData.objects.update_or_create(
                variety=variety,
                accession_number=f"SRR-SUN-{index:06d}",
                data_type=data_types[index % len(data_types)],
                defaults={
                    "platform": platforms[index % len(platforms)],
                    "read_length": 150 if index % 3 else 250,
                    "coverage": decimal_value("18.50", index % 9, "2.75"),
                    "total_reads": f"{42 + index * 6} M",
                    "raw_data_size": f"{12 + index * 3} GB",
                    "clean_data_size": f"{10 + index * 3} GB",
                    "mapping_rate": decimal_value("91.20", index % 6, "0.85"),
                    "reference_genome": "HanXRQr2.0-SUN",
                    "snp_count": 128000 + index * 5320,
                    "indel_count": 18400 + index * 760,
                    "data_url": f"https://example.org/sunnfcdb/sequencing/SRR-SUN-{index:06d}",
                    "public_database": "SunNFCDB local / demo",
                    "submission_date": date(2025, 4, min(28, index + 1)),
                    "notes": "示例测序数据记录，供页面联调展示。",
                },
            )
            count += 1
        return count

    def seed_diversity(self, varieties, markers):
        analyses = [
            {
                "analysis_name": "核心种质 SSR/SNP 综合 PCA",
                "analysis_type": "PCA",
                "marker_type": "SSR/SNP/KASP",
                "description": "基于核心标记矩阵评估向日葵种质主成分分布。",
                "analysis_date": date(2025, 5, 12),
                "result_data": {"pc1": 34.2, "pc2": 18.7, "groups": ["高油型", "早熟型", "抗旱型"]},
            },
            {
                "analysis_name": "高油材料聚类分析",
                "analysis_type": "clustering",
                "marker_type": "SSR/INDEL",
                "description": "按 UPGMA 聚类划分高油材料亲缘组。",
                "analysis_date": date(2025, 5, 18),
                "result_data": {"clusters": 4, "distance": "Nei genetic distance", "threshold": 0.62},
            },
            {
                "analysis_name": "群体结构 K=3 分析",
                "analysis_type": "structure",
                "marker_type": "SNP/KASP",
                "description": "核心材料可划分为三个主要遗传群体。",
                "analysis_date": date(2025, 6, 2),
                "result_data": {"best_k": 3, "delta_k": 21.4, "admixture_count": 6},
            },
            {
                "analysis_name": "抗旱相关标记 AMOVA",
                "analysis_type": "AMOVA",
                "marker_type": "SNP",
                "description": "比较不同生态区材料在抗旱相关位点上的遗传变异。",
                "analysis_date": date(2025, 6, 20),
                "result_data": {"among_regions": 22.6, "within_regions": 77.4, "p_value": 0.01},
            },
        ]
        count = 0
        for row in analyses:
            GeneticDiversityAnalysis.objects.update_or_create(
                analysis_name=row["analysis_name"],
                defaults={
                    "analysis_type": row["analysis_type"],
                    "marker_type": row["marker_type"],
                    "marker_count": len(markers),
                    "variety_count": len(varieties),
                    "result_data": json.dumps(row["result_data"], ensure_ascii=False),
                    "result_image_url": "",
                    "description": row["description"],
                    "analysis_date": row["analysis_date"],
                },
            )
            count += 1
        return count
