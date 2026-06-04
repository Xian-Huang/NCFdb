from datetime import date
from decimal import Decimal
import json

from django.apps import apps
from django.db import transaction


APP_PROFILES = {
    "sesame": {
        "prefix": "SES",
        "crop": "芝麻",
        "genome": "Si_v2.0",
        "traits": ["木酚素含量", "含油率", "抗倒伏", "蒴果抗裂", "早熟性", "籽粒颜色", "抗旱性", "核心种质校验"],
        "region": ("芝麻核心种质圃", "SES-DEMO-CORE"),
        "donor": "河南省农业科学院芝麻研究中心",
        "seed_colors": ["白色", "黑色", "褐色", "黄褐色"],
    },
    "flaxdb": {
        "prefix": "FLX",
        "crop": "胡麻",
        "genome": "Lu_v1.0",
        "traits": ["亚麻酸含量", "含油率", "抗旱性", "纤维品质", "株高", "早熟性", "籽粒颜色", "核心种质校验"],
        "region": ("胡麻核心种质圃", "FLX-DEMO-CORE"),
        "donor": "郑州轻工业大学",
        "seed_colors": ["褐色", "黄色", "深褐色", "浅褐色"],
    },
    "perilla": {
        "prefix": "PER",
        "crop": "紫苏",
        "genome": "Pf_v1.0",
        "traits": ["挥发油组分", "迷迭香酸含量", "叶色", "籽粒含油率", "香气型", "抗寒性", "株型", "核心种质校验"],
        "region": ("紫苏核心种质圃", "PER-DEMO-CORE"),
        "donor": "中国农业科学院油料作物研究所",
        "seed_colors": ["灰褐色", "褐色", "深褐色", "黑褐色"],
    },
    "safflower": {
        "prefix": "SAF",
        "crop": "红花",
        "genome": "Ct_v1.0",
        "traits": ["羟基红花黄色素A", "花色", "油酸含量", "抗旱性", "株高", "分枝数", "早熟性", "核心种质校验"],
        "region": ("红花核心种质圃", "SAF-DEMO-CORE"),
        "donor": "山西农业大学",
        "seed_colors": ["白色", "黄白色", "褐色", "灰白色"],
    },
    "sunnfcdb": {
        "prefix": "SUN",
        "crop": "向日葵",
        "genome": "HanXRQr2.0",
        "traits": ["油酸含量", "含油率", "锈病抗性", "抗旱性", "分枝性", "种皮颜色", "早熟性", "核心种质校验"],
        "region": ("向日葵核心种质圃", "SUN-DEMO-CORE"),
        "donor": "郑州轻工业大学",
        "seed_colors": ["条纹", "黑色", "灰条纹", "褐色"],
    },
}


def model(name):
    for app_label in APP_PROFILES:
        try:
            return apps.get_model(app_label, name)
        except LookupError:
            continue
    raise LookupError(f"Cannot find model {name}")


def current_profile():
    labels = {config.label for config in apps.get_app_configs()}
    for label, profile in APP_PROFILES.items():
        if label in labels:
            return profile
    return APP_PROFILES["sesame"]


def dec(value):
    return Decimal(str(value))


def ensure_varieties(Region, Variety, profile):
    region_name, region_code = profile["region"]
    region, _ = Region.objects.update_or_create(
        code=region_code,
        defaults={
            "name": region_name,
            "country": "中国",
            "climate": "区域特征营养与分子指纹图谱数据库演示区",
            "description": "用于展示分子指纹矩阵和核心种质校验的演示区域。",
        },
    )
    existing = list(Variety.objects.order_by("id")[:12])
    if len(existing) >= 6:
        return existing

    created = []
    prefix = profile["prefix"]
    for index in range(1, 9):
        variety, _ = Variety.objects.update_or_create(
            variety_code=f"{prefix}-DEMO-{index:03d}",
            defaults={
                "name": f"{profile['crop']}演示种质{index:02d}",
                "region": region,
                "seed_color": profile["seed_colors"][index % len(profile["seed_colors"])],
                "oil_content": dec(42 + index * 1.35),
                "maturity_days": 85 + index * 3,
                "yield_per_hectare": dec(1200 + index * 86),
                "height": dec(85 + index * 5.5),
                "description": "分子指纹功能演示材料，可通过后台替换为正式品种。",
            },
        )
        created.append(variety)
    return list(Variety.objects.order_by("id")[:12]) or created


def marker_rows(profile):
    prefix = profile["prefix"]
    traits = profile["traits"]
    types = ["SSR", "SSR", "SNP", "SNP", "INDEL", "INDEL", "KASP", "KASP", "EST-SSR", "gSSR"]
    rows = []
    for index, marker_type in enumerate(types, start=1):
        chromosome = f"Chr{index:02d}"
        row = {
            "marker_id": f"{prefix}-{marker_type}-{index:03d}",
            "marker_name": f"{profile['crop']}-{marker_type}-{index:03d}",
            "marker_type": marker_type,
            "chromosome": chromosome,
            "position": 1_200_000 + index * 873_211,
            "forward_primer": f"ATGCGTAC{index:02d}GTTACG",
            "reverse_primer": f"CGTAACGT{index:02d}CATGCA",
            "expected_size": f"{138 + index * 9}-{158 + index * 9} bp",
            "reference_allele": ["A", "C", "G", "T"][index % 4],
            "alternate_allele": ["T", "G", "A", "C"][index % 4],
            "annotated_gene": f"{prefix}G{index:05d}",
            "associated_trait": traits[(index - 1) % len(traits)],
            "polymorphism_rate": dec(46 + index * 4.1),
            "pic": dec(round(0.31 + index * 0.047, 3)),
            "notes": "演示标记：用于品种指纹条带、相似性聚类和核心种质校验。",
        }
        if marker_type in {"SNP", "KASP"}:
            row["expected_size"] = ""
            row["forward_primer"] = ""
            row["reverse_primer"] = ""
        rows.append(row)
    return rows


def genotype_for(variety_index, marker_index, marker):
    alleles = [
        ("A", "A", "AA"),
        ("A", "B", "AB"),
        ("B", "B", "BB"),
        ("C", "T", "CT"),
        ("G", "A", "GA"),
        ("DEL", "INS", "DI"),
    ]
    a1, a2, code = alleles[(variety_index + marker_index) % len(alleles)]
    if marker.marker_type in {"SSR", "EST-SSR", "gSSR"}:
        base = 140 + marker_index * 13
        a1 = str(base + (variety_index % 4) * 4)
        a2 = str(base + ((variety_index + marker_index) % 4) * 4)
        code = f"{a1}/{a2}"
        fragment_size = f"{a1}-{a2} bp" if a1 != a2 else f"{a1} bp"
    elif marker.marker_type == "INDEL":
        fragment_size = "插入型" if code != "BB" else "缺失型"
    else:
        fragment_size = ""
    return a1, a2, code, fragment_size


def run():
    profile = current_profile()
    Region = model("Region")
    Variety = model("Variety")
    MarkerLocus = model("MarkerLocus")
    MolecularFingerprint = model("MolecularFingerprint")
    SequencingData = model("SequencingData")
    GermplasmResource = model("GermplasmResource")
    GeneticDiversityAnalysis = model("GeneticDiversityAnalysis")

    with transaction.atomic():
        varieties = ensure_varieties(Region, Variety, profile)
        markers = []
        for row in marker_rows(profile):
            marker, _ = MarkerLocus.objects.update_or_create(marker_id=row["marker_id"], defaults=row)
            markers.append(marker)

        germplasm_types = ["cultivar", "breeding_line", "landrace", "mutant", "cultivar"]
        resistance = ["high", "medium", "medium", "low", "high"]
        for index, variety in enumerate(varieties, start=1):
            region_name = variety.region.name if getattr(variety, "region", None) else profile["region"][0]
            fingerprint_profile = "; ".join(
                f"{marker.marker_id}:{genotype_for(index, marker_index, marker)[2]}"
                for marker_index, marker in enumerate(markers[:6], start=1)
            )
            GermplasmResource.objects.update_or_create(
                variety=variety,
                defaults={
                    "germplasm_number": f"{profile['prefix']}-GR-{index:04d}",
                    "germplasm_type": germplasm_types[index % len(germplasm_types)],
                    "collection_site": region_name,
                    "collection_year": 2012 + index,
                    "donor_institution": profile["donor"],
                    "ploidy": "2x",
                    "genome_size": "演示基因组",
                    "chromosome_number": 26 + (index % 3) * 2,
                    "plant_height": dec(80 + index * 4.6),
                    "branch_number": 1 + index % 5,
                    "capsule_number": 3 + index % 8,
                    "seeds_per_capsule": 48 + index * 7,
                    "thousand_seed_weight": dec(2.8 + index * 0.42),
                    "seed_coat_color": variety.seed_color or profile["seed_colors"][index % len(profile["seed_colors"])],
                    "flower_color": "黄色",
                    "stem_color": "绿色",
                    "disease_resistance": "演示抗性等级：中抗",
                    "drought_resistance": resistance[index % len(resistance)],
                    "fingerprint_profile": fingerprint_profile,
                    "has_molecular_data": True,
                    "has_sequencing_data": index <= min(8, len(varieties)),
                    "notes": "演示记录：用于展示核心种质校验和指纹条带。",
                },
            )

        fingerprint_count = 0
        for variety_index, variety in enumerate(varieties, start=1):
            for marker_index, marker in enumerate(markers, start=1):
                allele1, allele2, code, fragment_size = genotype_for(variety_index, marker_index, marker)
                MolecularFingerprint.objects.update_or_create(
                    variety=variety,
                    marker=marker,
                    defaults={
                        "allele1": allele1,
                        "allele2": allele2,
                        "genotype_code": code,
                        "fragment_size": fragment_size,
                        "quality_score": 86 + ((variety_index + marker_index) % 14),
                        "notes": "演示记录：核心标记矩阵分型结果。",
                    },
                )
                fingerprint_count += 1

        platforms = ["Illumina NovaSeq 6000", "MGISEQ-2000", "PacBio Sequel II", "Oxford Nanopore"]
        data_types = ["WGS", "RNA-seq", "GBS", "RAD-seq"]
        sequencing_count = 0
        for index, variety in enumerate(varieties[:8], start=1):
            SequencingData.objects.update_or_create(
                variety=variety,
                accession_number=f"DEMO-{profile['prefix']}-{index:06d}",
                data_type=data_types[index % len(data_types)],
                defaults={
                    "platform": platforms[index % len(platforms)],
                    "read_length": 150 if index % 3 else 250,
                    "coverage": dec(18 + index * 2.35),
                    "total_reads": f"{36 + index * 5} M",
                    "raw_data_size": f"{10 + index * 2} GB",
                    "clean_data_size": f"{9 + index * 2} GB",
                    "mapping_rate": dec(90 + index * 0.8),
                    "reference_genome": profile["genome"],
                    "snp_count": 98000 + index * 6400,
                    "indel_count": 14200 + index * 840,
                    "data_url": f"https://example.org/{profile['prefix'].lower()}/sequencing/DEMO-{profile['prefix']}-{index:06d}",
                    "public_database": "Local demo",
                    "submission_date": date(2025, 5, min(28, index + 2)),
                    "notes": "演示记录：用于测序记录展示。",
                },
            )
            sequencing_count += 1

        analyses = [
            ("核心种质 PCA 分析", "PCA", "SSR/SNP/KASP", {"pc1": 31.8, "pc2": 19.6, "groups": ["I", "II", "III"]}),
            ("品种相似性 UPGMA 聚类", "clustering", "SSR/INDEL", {"clusters": 4, "threshold": 0.68, "method": "UPGMA"}),
            ("功能位点群体结构 K=3", "structure", "SNP/KASP", {"best_k": 3, "delta_k": 18.4, "admixture": 5}),
            ("核心种质一致性校验", "kinship", "SSR/SNP/INDEL/KASP", {"core_pass": len(varieties) - 1, "duplicate_alerts": 1, "mean_similarity": 0.73}),
        ]
        diversity_count = 0
        for index, (name, analysis_type, marker_type, result_data) in enumerate(analyses, start=1):
            GeneticDiversityAnalysis.objects.update_or_create(
                analysis_name=f"{profile['crop']}{name}",
                defaults={
                    "analysis_type": analysis_type,
                    "marker_type": marker_type,
                    "marker_count": len(markers),
                    "variety_count": len(varieties),
                    "result_data": json.dumps(result_data, ensure_ascii=False),
                    "result_image_url": "",
                    "description": f"基于 {len(markers)} 个核心标记和 {len(varieties)} 份材料完成{name}。",
                    "analysis_date": date(2025, 6, min(28, index * 5)),
                },
            )
            diversity_count += 1

    print(
        f"{profile['crop']} demo molecular data seeded: "
        f"{len(markers)} markers, {fingerprint_count} fingerprints, "
        f"{len(varieties)} germplasm, {sequencing_count} sequencing, {diversity_count} analyses."
    )


run()
