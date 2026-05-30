from decimal import Decimal

from django.core.management.base import BaseCommand
from django.db import transaction

from sunnfcdb.models import (
    EnvironmentalFactor,
    Region,
    RegionalEnvironmentValue,
    RegionalMapSite,
    Variety,
)


FACTORS = [
    {
        "code": "TEMP_AVG",
        "name": "生育期平均温度",
        "unit": "℃",
        "category": "温度",
        "description": "区域试验点生育期平均温度范围。",
        "min_value": Decimal("6.0000"),
        "max_value": Decimal("16.0000"),
    },
    {
        "code": "PRECIP_ANNUAL",
        "name": "年降水量",
        "unit": "mm",
        "category": "降水",
        "description": "区域试验点年降水量范围。",
        "min_value": Decimal("120.0000"),
        "max_value": Decimal("780.0000"),
    },
    {
        "code": "SUNSHINE_HOURS",
        "name": "年日照时数",
        "unit": "h",
        "category": "日照",
        "description": "区域试验点年日照时数范围。",
        "min_value": Decimal("2200.0000"),
        "max_value": Decimal("3200.0000"),
    },
    {
        "code": "SOIL_TYPE",
        "name": "土壤类型",
        "unit": "",
        "category": "土壤",
        "description": "区域试验点主要土壤类型。",
    },
]


SITES = [
    {
        "region": {"code": "CN-NMG-HETAO", "name": "内蒙古河套灌区", "climate": "温带半干旱灌溉农业区"},
        "site": {
            "code": "SUN-MAP-NMG-HETAO",
            "name": "河套灌区品质评价点",
            "province": "内蒙古自治区",
            "longitude": Decimal("107.40000"),
            "latitude": Decimal("40.75000"),
            "trait": "高油与抗旱适应性",
            "component": "油分 46.5%-49.2%，蛋白质 17.8%-19.4%",
            "soil": "灌淤土 / 沙壤土",
            "display_order": 10,
            "description": "覆盖巴彦淖尔河套灌区，用于评价灌溉条件下高油向日葵品种稳定性。",
        },
        "varieties": [
            {"code": "SUN-VAR-NMG-001", "name": "SH363", "oil_content": Decimal("48.60"), "maturity_days": 103},
            {"code": "SUN-VAR-NMG-002", "name": "LD5009", "oil_content": Decimal("47.80"), "maturity_days": 101},
        ],
        "environment": {"TEMP_AVG": (Decimal("8"), Decimal("10")), "PRECIP_ANNUAL": (Decimal("180"), Decimal("300")), "SUNSHINE_HOURS": (Decimal("2900"), Decimal("3200")), "SOIL_TYPE": "灌淤土 / 沙壤土"},
    },
    {
        "region": {"code": "CN-XJ-OASIS", "name": "新疆绿洲灌区", "climate": "温带大陆性干旱气候"},
        "site": {
            "code": "SUN-MAP-XJ-OASIS",
            "name": "新疆绿洲耐盐筛选点",
            "province": "新疆维吾尔自治区",
            "longitude": Decimal("87.62000"),
            "latitude": Decimal("43.82000"),
            "trait": "耐盐与高油稳定性",
            "component": "油分 45.8%-48.5%，亚油酸 58.0%-62.4%",
            "soil": "盐化灌淤土 / 沙壤土",
            "display_order": 20,
            "description": "用于筛选干旱绿洲灌溉条件下的耐盐和高油材料。",
        },
        "varieties": [
            {"code": "SUN-VAR-XJ-001", "name": "新葵 18 号", "oil_content": Decimal("47.90"), "maturity_days": 108},
            {"code": "SUN-VAR-XJ-002", "name": "XK102", "oil_content": Decimal("46.70"), "maturity_days": 106},
        ],
        "environment": {"TEMP_AVG": (Decimal("9"), Decimal("12")), "PRECIP_ANNUAL": (Decimal("120"), Decimal("220")), "SUNSHINE_HOURS": (Decimal("2850"), Decimal("3150")), "SOIL_TYPE": "盐化灌淤土 / 沙壤土"},
    },
    {
        "region": {"code": "CN-HLJ-COOL", "name": "黑龙江冷凉熟化区", "climate": "寒温带季风气候"},
        "site": {
            "code": "SUN-MAP-HLJ-COOL",
            "name": "黑龙江冷凉区熟期观察点",
            "province": "黑龙江省",
            "longitude": Decimal("126.64000"),
            "latitude": Decimal("45.76000"),
            "trait": "早熟与低温适应",
            "component": "油分 42.6%-45.2%，蛋白质 18.5%-20.0%",
            "soil": "黑土 / 草甸土",
            "display_order": 30,
            "description": "面向冷凉区短生育期品种，重点评价早熟性和低温适应能力。",
        },
        "varieties": [
            {"code": "SUN-VAR-HLJ-001", "name": "龙葵杂 3 号", "oil_content": Decimal("44.80"), "maturity_days": 95},
            {"code": "SUN-VAR-HLJ-002", "name": "SH361", "oil_content": Decimal("43.90"), "maturity_days": 92},
        ],
        "environment": {"TEMP_AVG": (Decimal("6"), Decimal("9")), "PRECIP_ANNUAL": (Decimal("450"), Decimal("650")), "SUNSHINE_HOURS": (Decimal("2400"), Decimal("2700")), "SOIL_TYPE": "黑土 / 草甸土"},
    },
    {
        "region": {"code": "CN-JL-DISEASE", "name": "吉林抗病鉴定区", "climate": "温带季风气候"},
        "site": {
            "code": "SUN-MAP-JL-DISEASE",
            "name": "吉林病害抗性鉴定点",
            "province": "吉林省",
            "longitude": Decimal("125.32000"),
            "latitude": Decimal("43.90000"),
            "trait": "菌核病抗性与籽粒商品性",
            "component": "油分 43.8%-46.2%，油酸 28.0%-34.5%",
            "soil": "黑钙土 / 壤土",
            "display_order": 40,
            "description": "用于东北春播区菌核病抗性、熟期和商品性综合评价。",
        },
        "varieties": [
            {"code": "SUN-VAR-JL-001", "name": "吉葵 2 号", "oil_content": Decimal("45.20"), "maturity_days": 98},
            {"code": "SUN-VAR-JL-002", "name": "JK212", "oil_content": Decimal("44.60"), "maturity_days": 99},
        ],
        "environment": {"TEMP_AVG": (Decimal("8"), Decimal("11")), "PRECIP_ANNUAL": (Decimal("500"), Decimal("700")), "SUNSHINE_HOURS": (Decimal("2300"), Decimal("2650")), "SOIL_TYPE": "黑钙土 / 壤土"},
    },
    {
        "region": {"code": "CN-NX-SALINE", "name": "宁夏盐碱适应区", "climate": "温带半干旱灌溉气候"},
        "site": {
            "code": "SUN-MAP-NX-SALINE",
            "name": "宁夏盐碱地适应性试验点",
            "province": "宁夏回族自治区",
            "longitude": Decimal("106.23000"),
            "latitude": Decimal("38.49000"),
            "trait": "耐盐碱与出苗活力",
            "component": "油分 44.5%-46.8%，蛋白质 17.5%-18.8%",
            "soil": "盐化灌淤土 / 沙壤土",
            "display_order": 50,
            "description": "面向盐碱地种植场景，关注苗期活力、耐盐碱和产量稳定性。",
        },
        "varieties": [
            {"code": "SUN-VAR-NX-001", "name": "宁葵 1 号", "oil_content": Decimal("45.70"), "maturity_days": 100},
            {"code": "SUN-VAR-NX-002", "name": "SH363-NX", "oil_content": Decimal("46.10"), "maturity_days": 101},
        ],
        "environment": {"TEMP_AVG": (Decimal("6"), Decimal("9")), "PRECIP_ANNUAL": (Decimal("180"), Decimal("300")), "SUNSHINE_HOURS": (Decimal("2800"), Decimal("3100")), "SOIL_TYPE": "盐化灌淤土 / 沙壤土"},
    },
    {
        "region": {"code": "CN-GS-DRYLAND", "name": "甘肃旱作评价区", "climate": "温带干旱半干旱气候"},
        "site": {
            "code": "SUN-MAP-GS-DRYLAND",
            "name": "甘肃旱作区抗旱评价点",
            "province": "甘肃省",
            "longitude": Decimal("103.83000"),
            "latitude": Decimal("36.06000"),
            "trait": "抗旱与籽粒饱满度",
            "component": "油分 45.0%-47.3%，亚油酸 56.2%-61.0%",
            "soil": "黄绵土 / 灰钙土",
            "display_order": 60,
            "description": "评价旱作条件下品种灌浆、籽粒饱满度和油分稳定性。",
        },
        "varieties": [
            {"code": "SUN-VAR-GS-001", "name": "陇葵杂 4 号", "oil_content": Decimal("46.10"), "maturity_days": 104},
            {"code": "SUN-VAR-GS-002", "name": "GK901", "oil_content": Decimal("45.60"), "maturity_days": 105},
        ],
        "environment": {"TEMP_AVG": (Decimal("9"), Decimal("12")), "PRECIP_ANNUAL": (Decimal("250"), Decimal("420")), "SUNSHINE_HOURS": (Decimal("2600"), Decimal("3000")), "SOIL_TYPE": "黄绵土 / 灰钙土"},
    },
    {
        "region": {"code": "CN-HEB-ADAPT", "name": "河北适应性鉴定区", "climate": "暖温带半湿润季风气候"},
        "site": {
            "code": "SUN-MAP-HEB-ADAPT",
            "name": "河北广适性鉴定点",
            "province": "河北省",
            "longitude": Decimal("114.52000"),
            "latitude": Decimal("38.04000"),
            "trait": "广适性与抗倒伏",
            "component": "油分 43.6%-45.8%，油酸 70.0%-78.5%",
            "soil": "褐土 / 潮土",
            "display_order": 70,
            "description": "服务华北春夏播过渡区，评价品种适应性、抗倒伏和品质指标。",
        },
        "varieties": [
            {"code": "SUN-VAR-HEB-001", "name": "冀葵杂 2 号", "oil_content": Decimal("44.40"), "maturity_days": 100},
            {"code": "SUN-VAR-HEB-002", "name": "NK212", "oil_content": Decimal("45.10"), "maturity_days": 102},
        ],
        "environment": {"TEMP_AVG": (Decimal("10"), Decimal("13")), "PRECIP_ANNUAL": (Decimal("450"), Decimal("650")), "SUNSHINE_HOURS": (Decimal("2400"), Decimal("2800")), "SOIL_TYPE": "褐土 / 潮土"},
    },
    {
        "region": {"code": "CN-SD-QUALITY", "name": "山东品质验证区", "climate": "暖温带季风气候"},
        "site": {
            "code": "SUN-MAP-SD-QUALITY",
            "name": "山东品质验证点",
            "province": "山东省",
            "longitude": Decimal("117.12000"),
            "latitude": Decimal("36.65000"),
            "trait": "油酸积累与商品性",
            "component": "油分 42.8%-44.9%，油酸 76.0%-82.0%",
            "soil": "棕壤 / 潮土",
            "display_order": 80,
            "description": "验证高油酸材料在黄淮海区域的品质表现和商品籽粒稳定性。",
        },
        "varieties": [
            {"code": "SUN-VAR-SD-001", "name": "山葵 5 号", "oil_content": Decimal("43.80"), "maturity_days": 99},
            {"code": "SUN-VAR-SD-002", "name": "DK3790", "oil_content": Decimal("44.30"), "maturity_days": 101},
        ],
        "environment": {"TEMP_AVG": (Decimal("11"), Decimal("14")), "PRECIP_ANNUAL": (Decimal("600"), Decimal("780")), "SUNSHINE_HOURS": (Decimal("2300"), Decimal("2600")), "SOIL_TYPE": "棕壤 / 潮土"},
    },
]


class Command(BaseCommand):
    help = "写入区域优势品种与环境因子地图基础数据"

    @transaction.atomic
    def handle(self, *args, **options):
        factors = {}
        for row in FACTORS:
            factor, _ = EnvironmentalFactor.objects.update_or_create(
                code=row["code"],
                defaults={
                    "name": row["name"],
                    "unit": row.get("unit", ""),
                    "category": row.get("category", ""),
                    "description": row.get("description", ""),
                    "min_value": row.get("min_value"),
                    "max_value": row.get("max_value"),
                },
            )
            factors[row["code"]] = factor

        site_count = 0
        variety_count = 0
        env_count = 0
        for row in SITES:
            region_payload = row["region"]
            region, _ = Region.objects.update_or_create(
                code=region_payload["code"],
                defaults={
                    "name": region_payload["name"],
                    "country": "中国",
                    "climate": region_payload["climate"],
                    "description": f"{region_payload['name']}区域地图数据关联区域。",
                },
            )

            variety_objects = []
            for variety_payload in row["varieties"]:
                variety, _ = Variety.objects.update_or_create(
                    variety_code=variety_payload["code"],
                    defaults={
                        "name": variety_payload["name"],
                        "region": region,
                        "seed_color": "条纹",
                        "oil_content": variety_payload["oil_content"],
                        "maturity_days": variety_payload["maturity_days"],
                        "description": f"{region.name}区域优势代表品种。",
                    },
                )
                variety_objects.append(variety)
                variety_count += 1

            site_payload = row["site"]
            site, _ = RegionalMapSite.objects.update_or_create(
                code=site_payload["code"],
                defaults={**site_payload, "region": region, "is_active": True},
            )
            site.varieties.set(variety_objects)
            site_count += 1

            for factor_code, value in row["environment"].items():
                factor = factors[factor_code]
                defaults = {}
                if isinstance(value, tuple):
                    defaults["value_min"], defaults["value_max"] = value
                    unit = factor.unit or ""
                    defaults["display_value"] = f"{value[0]:g}-{value[1]:g} {unit}".strip()
                    defaults["note"] = ""
                else:
                    defaults["value_min"] = None
                    defaults["value_max"] = None
                    defaults["display_value"] = value
                    defaults["note"] = "土壤类型按区域试验点主要土类维护。"

                RegionalEnvironmentValue.objects.update_or_create(
                    site=site,
                    factor=factor,
                    defaults=defaults,
                )
                env_count += 1

        self.stdout.write(self.style.SUCCESS(
            f"区域地图数据写入完成：环境因子 {len(factors)} 个，地图点 {site_count} 个，品种关联 {variety_count} 个，环境值 {env_count} 条。"
        ))
