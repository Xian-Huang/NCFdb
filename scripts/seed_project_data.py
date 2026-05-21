from datetime import timedelta
from decimal import Decimal

from django.apps import apps
from django.contrib.auth.models import User
from django.utils import timezone


PROJECTS = {
    "flaxdb": {
        "name": "FlaxDB",
        "cn": "亚麻",
        "prefix": "FLX",
        "species": "Linum usitatissimum",
        "seed_colors": ["棕色", "金黄色", "浅褐色"],
        "traits": ["高含油量", "抗倒伏", "早熟", "纤维品质"],
        "regions": [
            ("黑龙江亚麻寒地种质区", "FLX-HLJ", "中国", "温带季风气候"),
            ("内蒙古旱作亚麻试验区", "FLX-NMG", "中国", "半干旱大陆性气候"),
            ("加拿大草原亚麻参考区", "FLX-CAN", "加拿大", "冷凉草原气候"),
        ],
    },
    "perilla": {
        "name": "PerillaDB",
        "cn": "紫苏",
        "prefix": "PER",
        "species": "Perilla frutescens",
        "seed_colors": ["灰褐色", "深褐色", "黑褐色"],
        "traits": ["芳香成分", "籽粒含油量", "抗病性", "叶色性状"],
        "regions": [
            ("吉林紫苏种质观察区", "PER-JL", "中国", "温带季风气候"),
            ("贵州山地紫苏试验区", "PER-GZ", "中国", "亚热带湿润气候"),
            ("韩国紫苏参考群体", "PER-KR", "韩国", "海洋性季风气候"),
        ],
    },
    "safflower": {
        "name": "SafflowerDB",
        "cn": "红花",
        "prefix": "SAF",
        "species": "Carthamus tinctorius",
        "seed_colors": ["白色", "乳白色", "浅褐色"],
        "traits": ["花冠色素", "耐旱性", "油酸含量", "分枝数"],
        "regions": [
            ("新疆红花核心种质区", "SAF-XJ", "中国", "干旱大陆性气候"),
            ("云南高原红花试验区", "SAF-YN", "中国", "高原季风气候"),
            ("印度干热红花参考区", "SAF-IN", "印度", "热带干湿季气候"),
        ],
    },
    "sesame": {
        "name": "SesameDB",
        "cn": "芝麻",
        "prefix": "SES",
        "species": "Sesamum indicum",
        "seed_colors": ["白色", "黑色", "黄褐色"],
        "traits": ["芝麻素含量", "抗裂蒴", "高产", "耐渍性"],
        "regions": [
            ("河南芝麻主产区", "SES-HN", "中国", "暖温带季风气候"),
            ("湖北江汉芝麻试验区", "SES-HB", "中国", "亚热带季风气候"),
            ("埃塞俄比亚芝麻参考区", "SES-ET", "埃塞俄比亚", "热带高原气候"),
        ],
    },
    "sunnfcdb": {
        "name": "SunflowerDB",
        "cn": "向日葵",
        "prefix": "SUN",
        "species": "Helianthus annuus",
        "seed_colors": ["黑色", "条纹", "灰黑色"],
        "traits": ["高油酸", "耐盐碱", "抗锈病", "株型紧凑"],
        "regions": [
            ("内蒙古向日葵主产区", "SUN-NMG", "中国", "半干旱大陆性气候"),
            ("新疆盐碱地向日葵试验区", "SUN-XJ", "中国", "干旱大陆性气候"),
            ("美国北达科他参考区", "SUN-ND", "美国", "温带大陆性气候"),
        ],
    },
}


def detect_app_label():
    for label in PROJECTS:
        try:
            apps.get_model(label, "News")
            return label
        except LookupError:
            continue
    raise RuntimeError("Cannot detect crop app label for this Django project.")


def model(label, name):
    return apps.get_model(label, name)


def upsert_user(username, password, **defaults):
    user, _ = User.objects.update_or_create(username=username, defaults=defaults)
    user.set_password(password)
    user.save()
    return user


def seed_common(label, info):
    Region = model(label, "Region")
    Variety = model(label, "Variety")
    NutritionData = model(label, "NutritionData")
    Gene = model(label, "Gene")
    GeneExpression = model(label, "GeneExpression")
    EnvironmentalFactor = model(label, "EnvironmentalFactor")
    Institution = model(label, "Institution")
    Announcement = model(label, "Announcement")
    News = model(label, "News")
    Changelog = model(label, "Changelog")
    DownloadFile = model(label, "DownloadFile")

    today = timezone.localdate()
    now = timezone.now()

    regions = []
    for name, code, country, climate in info["regions"]:
        region, _ = Region.objects.update_or_create(
            code=code,
            defaults={
                "name": name,
                "country": country,
                "climate": climate,
                "description": f"{name}用于{info['cn']}种质资源、表型鉴定和环境适应性数据管理。",
            },
        )
        regions.append(region)

    varieties = []
    for index in range(1, 13):
        trait = info["traits"][(index - 1) % len(info["traits"])]
        region = regions[(index - 1) % len(regions)]
        variety, _ = Variety.objects.update_or_create(
            variety_code=f"{info['prefix']}-V{index:03d}",
            defaults={
                "name": f"{info['cn']}核心材料{index:02d}",
                "region": region,
                "seed_color": info["seed_colors"][(index - 1) % len(info["seed_colors"])],
                "oil_content": Decimal("34.80") + Decimal(index) * Decimal("0.92"),
                "maturity_days": 82 + index * 4,
                "yield_per_hectare": Decimal("1680.00") + Decimal(index * 118),
                "height": Decimal("76.00") + Decimal(index * 5),
                "description": f"面向{trait}研究的{info['cn']}核心材料，记录了区域来源、籽粒颜色、产量表现和品质性状，可用于页面筛选、统计和下载演示。",
            },
        )
        varieties.append(variety)

    for variety_index, variety in enumerate(varieties, start=1):
        for rep in range(1, 4):
            NutritionData.objects.update_or_create(
                variety=variety,
                sample_code=f"{info['prefix']}-N{variety_index:03d}-{rep}",
                defaults={
                    "oil_content": Decimal("32.40") + Decimal(variety_index) * Decimal("0.76") + Decimal(rep) * Decimal("0.35"),
                    "protein": Decimal("16.20") + Decimal((variety_index % 5)) * Decimal("0.82") + Decimal(rep) * Decimal("0.22"),
                    "fatty_acid": Decimal("48.50") + Decimal((variety_index % 7)) * Decimal("1.15"),
                    "lignan": Decimal("2.100") + Decimal(variety_index) * Decimal("0.137") + Decimal(rep) * Decimal("0.041"),
                    "moisture": Decimal("6.80") + Decimal(rep) * Decimal("0.18"),
                    "method": "HPLC/NIR validation",
                    "test_date": today - timedelta(days=variety_index * 3 + rep),
                },
            )

    genes = []
    pathways = ["脂肪酸生物合成", "逆境响应", "开花调控", "种子发育", "次生代谢", "抗病防御", "营养品质调控"]
    for index in range(1, 11):
        gene, _ = Gene.objects.update_or_create(
            gene_id=f"{info['prefix']}G{index:05d}",
            defaults={
                "name": f"{info['species']} candidate gene {index}",
                "symbol": f"{info['prefix']}{index}",
                "chromosome": f"Chr{index}",
                "start_position": 100000 * index + 2400,
                "end_position": 100000 * index + 7800,
                "strand": "+" if index % 2 else "-",
                "gene_type": "protein_coding",
                "description": f"{info['cn']}候选基因 {index}，包含染色体位置、功能注释和通路信息，用于演示基因检索、网络图和详情展示。",
                "function": f"可能参与{info['traits'][(index - 1) % len(info['traits'])]}相关调控，并在籽粒发育或逆境处理样本中表现出差异表达。",
                "pathway": pathways[(index - 1) % len(pathways)],
            },
        )
        genes.append(gene)

    tissues = ["根", "茎", "叶", "种子"]
    stages = ["苗期", "开花期", "灌浆期"]
    for gene_index, gene in enumerate(genes[:8], start=1):
        for variety_index, variety in enumerate(varieties[:6], start=1):
            tissue = tissues[(gene_index + variety_index) % len(tissues)]
            stage = stages[(gene_index - 1) % len(stages)]
            value = Decimal(gene_index * variety_index) + Decimal("3.2500")
            GeneExpression.objects.update_or_create(
                gene=gene,
                variety=variety,
                tissue=tissue,
                stage=stage,
                defaults={
                    "expression_value": value,
                    "fpkm": value + Decimal("1.1000"),
                    "tpm": value + Decimal("2.3000"),
                    "sample_id": f"{info['prefix']}-S{gene_index}{variety_index}",
                },
            )

    factors = [
        ("年均温", "TEMP", "degC", "气候", Decimal("-10.0000"), Decimal("38.0000")),
        ("年降水量", "RAIN", "mm", "气候", Decimal("80.0000"), Decimal("1200.0000")),
        ("土壤pH", "SOILPH", "pH", "土壤", Decimal("5.5000"), Decimal("8.8000")),
        ("盐分胁迫", "SALINITY", "dS/m", "逆境", Decimal("0.0000"), Decimal("12.0000")),
    ]
    for name, code, unit, category, min_value, max_value in factors:
        EnvironmentalFactor.objects.update_or_create(
            code=f"{info['prefix']}-{code}",
            defaults={
                "name": name,
                "unit": unit,
                "category": category,
                "description": f"{name}是{info['cn']}环境适应性分析的关键因子。",
                "min_value": min_value,
                "max_value": max_value,
            },
        )

    institutions = []
    for index, city in enumerate(["北京", "哈尔滨", "乌鲁木齐", "郑州", "南京"], start=1):
        inst, _ = Institution.objects.update_or_create(
            name=f"{info['cn']}组学数据中心{index}",
            defaults={
                "abbreviation": f"{info['prefix']}-DC{index}",
                "country": "中国",
                "city": city,
                "address": f"{city}农业科研示范园区 {index} 号",
                "website": f"https://example.org/{info['prefix'].lower()}/center-{index}",
                "email": f"contact-{info['prefix'].lower()}{index}@example.org",
                "phone": f"010-88{index}{index}-2026",
                "contact_person": f"{info['cn']}管理员{index}",
                "description": f"负责{info['cn']}多组学数据整理、质控、区域试验协调和数据库共享服务。",
                "institution_type": "科研机构",
            },
        )
        institutions.append(inst)

    announcements = [
        ("数据库试运行通知", "系统", "high"),
        ("新增种质资源批量上传模板", "数据", "normal"),
        ("基因表达矩阵完成第一轮校验", "分析", "normal"),
    ]
    for index, (title, category, importance) in enumerate(announcements):
        Announcement.objects.update_or_create(
            title=f"{info['cn']}{title}",
            defaults={
                "content": f"{info['name']} 已补充{info['cn']}示例数据，支持新闻、下载、品种、基因和环境因子页面联调。",
                "announcement_type": category,
                "author": "NCFdb Team",
                "institution": institutions[index % len(institutions)],
                "importance": importance,
                "is_published": True,
                "publish_date": today - timedelta(days=index * 7),
                "expire_date": today + timedelta(days=120),
                "views": 120 + index * 37,
            },
        )

    news_items = [
        ("多组学数据库完成独立部署", "系统动态", True, "数据库完成前端页面、后端接口和独立数据表联调。当前版本重点整理了区域、品种、基因、表达量、营养指标和下载文件等核心对象。\n\n项目组同步建立了数据质控流程：导入前检查样品编号、区域代码和检测方法，导入后通过可视化摘要核对记录数量、缺失值和异常区间。该流程将持续用于后续真实数据批次。"),
        ("核心种质资源数据集上线", "资源发布", True, "本次上线的核心种质资源覆盖多个生态区和参考群体，每份材料均记录来源区域、籽粒颜色、成熟期、株高、产量和含油量等基础信息。\n\n这些数据可支持不同区域间的材料筛选，也可与营养成分、表达谱和候选基因结果联动，用于构建更接近真实科研流程的检索与展示场景。"),
        ("候选基因注释结果完成更新", "基因组学", False, "候选基因表补充了染色体位置、链方向、基因类型、功能描述和通路归属。脂肪酸合成、逆境响应、种子发育和次生代谢等通路均有代表性记录。\n\n后续版本将继续扩展同源基因、表达证据和变异位点链接，使基因页面可以承载从注释浏览到候选基因优先级排序的完整流程。"),
        ("环境因子与表型关联模块开放测试", "表型数据", False, "环境因子记录新增温度、降水、土壤 pH 和盐分胁迫等字段，为区域适应性分析提供基础维度。\n\n测试阶段重点观察不同生态区材料的含油量、蛋白质和特征功能成分变化，帮助用户理解环境背景对品质性状的影响。"),
        ("下载中心新增示例文件", "数据下载", False, "下载中心补充 Genome、Annotation、Expression、Variation、Nutrition 和 FieldTrial 六类文件记录。每条记录包含格式、版本、大小、描述和下载次数，可用于验证下载按钮、文件统计和详情说明。\n\n示例文件内容为演示用途，但字段命名尽量贴近真实数据库发布规范，便于后续替换为正式数据。"),
        ("营养品质检测批次完成入库", "营养分析", False, "营养数据表新增多批次样本记录，覆盖含油量、蛋白质、特征脂肪酸、功能成分和水分等指标。\n\n检测方法统一标记为 HPLC/NIR validation，便于 Research 页面分页、搜索、矩阵和柱状图展示。"),
        ("合作机构资料完成标准化", "合作网络", False, "机构信息补充了简称、城市、联系人、邮箱、网站和机构类型。联系页面将优先展示真实字段，并在缺失时使用统一占位说明。\n\n该结构可用于后续扩展数据提交单位、样品采集单位和分析审核单位之间的关系。"),
        ("年度数据审核工作流启动", "项目进展", True, "项目组启动年度数据审核工作流，重点核对样品编号唯一性、区域代码规范性、新闻正文完整度和下载文件版本号。\n\n审核结果会以更新日志、滚动通知和新闻详情的形式同步给用户，保证前端展示与数据库记录保持一致。"),
    ]
    for index, (title, category, scrolling, content) in enumerate(news_items):
        News.objects.update_or_create(
            title=f"{info['cn']}{title}",
            defaults={
                "content": f"{content}\n\n关联主题：{info['traits'][index % len(info['traits'])]}；物种：{info['species']}；数据库：{info['name']}。",
                "author": "NCFdb Team",
                "category": category,
                "tags": f"{info['cn']},数据库,{category},{info['traits'][index % len(info['traits'])]}",
                "views": 260 + index * 41,
                "is_published": True,
                "is_scrolling": scrolling,
                "publish_time": now - timedelta(days=index * 3),
            },
        )

    changes = [
        ("v1.0.0", "独立数据库初始化", ["创建独立 MySQL 数据库", "完成基础表结构迁移", "补充示例内容"]),
        ("v1.1.0", "前后端联调数据补充", ["新增新闻和公告", "新增品种与基因数据", "完善下载中心示例"]),
    ]
    for index, (version, title, change_list) in enumerate(changes):
        Changelog.objects.update_or_create(
            version=version,
            defaults={
                "title": f"{info['cn']}{title}",
                "content": f"{info['name']} {version} 更新记录。",
                "changes": change_list,
                "release_date": today - timedelta(days=30 - index * 10),
                "is_published": True,
            },
        )

    file_fields = {field.name for field in DownloadFile._meta.fields}
    for index, category in enumerate(["Genome", "Annotation", "Expression", "Variation", "Nutrition", "FieldTrial"], start=1):
        if "file_name" in file_fields:
            DownloadFile.objects.update_or_create(
                file_name=f"{info['prefix']}_{category.lower()}_demo_v1.tsv",
                defaults={
                    "file_type": "TSV",
                    "file_size": f"{12 + index * 3}.6 MB",
                    "description": f"{info['cn']}{category} 示例数据文件。",
                    "download_url": f"https://example.org/downloads/{info['prefix'].lower()}_{category.lower()}_demo_v1.tsv",
                    "category": category,
                    "version": "v1.0",
                    "is_published": True,
                },
            )
        else:
            DownloadFile.objects.update_or_create(
                title=f"{info['prefix']}_{category.lower()}_demo_v1.tsv",
                defaults={
                    "description": f"{info['cn']}{category} 示例数据文件。",
                    "size": (12 + index * 3) * 1024 * 1024,
                    "format": "TSV",
                    "downloads": 20 + index * 6,
                    "version": "v1.0",
                },
            )

    if label == "sunnfcdb":
        Nutrition = model(label, "Nutrition")
        for name, desc in [
            ("油酸", "向日葵籽油中的重要单不饱和脂肪酸指标。"),
            ("亚油酸", "用于评价向日葵油脂营养组成和加工品质。"),
            ("维生素E", "与抗氧化能力和籽粒营养品质相关。"),
        ]:
            Nutrition.objects.update_or_create(name=name, defaults={"desc": desc})


def main():
    label = detect_app_label()
    info = PROJECTS[label]
    upsert_user(
        "admin",
        "123456",
        email="admin@example.org",
        first_name="NCFdb",
        last_name="Admin",
        is_staff=True,
        is_superuser=True,
        is_active=True,
    )
    upsert_user(
        "editor",
        "123456",
        email="editor@example.org",
        first_name="NCFdb",
        last_name="Editor",
        is_staff=True,
        is_active=True,
    )
    seed_common(label, info)

    summary_models = ["News", "Announcement", "DownloadFile", "Region", "Variety", "NutritionData", "Gene", "GeneExpression"]
    if label == "sunnfcdb":
        summary_models.append("Nutrition")
    print(f"{info['name']} seeded successfully.")
    for model_name in summary_models:
        print(f"  {model_name}: {model(label, model_name).objects.count()}")
    print(f"  User: {User.objects.count()}")


main()
