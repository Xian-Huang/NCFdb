from decimal import Decimal

from django.core.management.base import BaseCommand
from django.db import transaction

from flaxdb.models import EnvironmentalFactor, Region, RegionalEnvironmentValue, RegionalMapSite, Variety

FACTORS = [
    {"code": "TEMP_AVG", "name": "生育期平均温度", "unit": "℃", "category": "温度", "description": "区域试验点生育期平均温度范围。"},
    {"code": "PRECIP_ANNUAL", "name": "年降水量", "unit": "mm", "category": "降水", "description": "区域试验点年降水量范围。"},
    {"code": "SUNSHINE_HOURS", "name": "年日照时数", "unit": "h", "category": "日照", "description": "区域试验点年日照时数范围。"},
    {"code": "SOIL_TYPE", "name": "土壤类型", "unit": "", "category": "土壤", "description": "区域试验点主要土壤类型。"},
]

SITES = [{'code': 'FLAX-MAP-HLJ', 'name': '黑龙江冷凉区高亚麻酸评价点', 'province': '黑龙江省', 'region_code': 'CN-HLJ-FLAX', 'region_name': '黑龙江冷凉亚麻区', 'climate': '寒温带冷凉季风气候', 'lng': '126.64000', 'lat': '45.76000', 'varieties': ['黑亚18', '垦亚10号'], 'trait': '高α-亚麻酸与早熟', 'component': 'ALA 54.2%，油分 39.6%', 'temperature': '2-5 ℃', 'precipitation': '500-650 mm', 'sunshine': '2300-2600 h', 'soil': '黑土'}, {'code': 'FLAX-MAP-NMG', 'name': '内蒙古旱作稳产评价区', 'province': '内蒙古自治区', 'region_code': 'CN-NMG-FLAX', 'region_name': '内蒙古旱作亚麻区', 'climate': '温带半干旱气候', 'lng': '111.76000', 'lat': '40.82000', 'varieties': ['坝亚9号', '内亚7号'], 'trait': '耐旱与稳产', 'component': 'ALA 51.8%，蛋白 21.4%', 'temperature': '5-8 ℃', 'precipitation': '300-450 mm', 'sunshine': '2700-3100 h', 'soil': '栗钙土 / 砂壤土'}, {'code': 'FLAX-MAP-GS', 'name': '甘肃冷旱区纤维品质观察点', 'province': '甘肃省', 'region_code': 'CN-GS-FLAX', 'region_name': '甘肃冷旱亚麻区', 'climate': '温带干旱半干旱气候', 'lng': '103.83000', 'lat': '36.06000', 'varieties': ['陇亚12', '定亚23'], 'trait': '纤维品质与抗旱性', 'component': 'ALA 50.6%，木酚素 7.9 mg/g', 'temperature': '6-9 ℃', 'precipitation': '250-420 mm', 'sunshine': '2550-2950 h', 'soil': '黄绵土 / 灰钙土'}]

def parse_range(text):
    value = str(text).replace('℃', '').replace('mm', '').replace('h', '').strip()
    value = value.replace(' ', '')
    if '-' not in value:
        return None, None
    left, right = value.split('-', 1)
    return Decimal(left), Decimal(right)

class Command(BaseCommand):
    help = "写入亚麻区域优势品种与环境因子地图基础数据"

    @transaction.atomic
    def handle(self, *args, **options):
        factors = {}
        for row in FACTORS:
            factor, _ = EnvironmentalFactor.objects.update_or_create(code=row['code'], defaults=row)
            factors[row['code']] = factor

        site_count = 0
        variety_count = 0
        env_count = 0
        for index, row in enumerate(SITES, start=1):
            region, _ = Region.objects.update_or_create(
                code=row['region_code'],
                defaults={'name': row['region_name'], 'country': '中国', 'climate': row['climate'], 'description': f"{row['region_name']}区域地图数据关联区域。"},
            )
            varieties = []
            for variety_index, name in enumerate(row['varieties'], start=1):
                variety, _ = Variety.objects.update_or_create(
                    variety_code=f"{row['code']}-V{variety_index}",
                    defaults={'name': name, 'region': region, 'seed_color': '地方种', 'oil_content': Decimal('42.00'), 'maturity_days': 100, 'description': f"{region.name}代表品种。"},
                )
                varieties.append(variety)
                variety_count += 1

            site, _ = RegionalMapSite.objects.update_or_create(
                code=row['code'],
                defaults={
                    'region': region, 'name': row['name'], 'province': row['province'],
                    'longitude': Decimal(row['lng']), 'latitude': Decimal(row['lat']),
                    'trait': row['trait'], 'component': row['component'], 'soil': row['soil'],
                    'display_order': index * 10, 'is_active': True,
                    'description': f"亚麻区域优势品种与环境因子地图试验点。",
                },
            )
            site.varieties.set(varieties)
            site_count += 1

            for key, factor_code in [('temperature', 'TEMP_AVG'), ('precipitation', 'PRECIP_ANNUAL'), ('sunshine', 'SUNSHINE_HOURS')]:
                value_min, value_max = parse_range(row[key])
                RegionalEnvironmentValue.objects.update_or_create(
                    site=site, factor=factors[factor_code],
                    defaults={'value_min': value_min, 'value_max': value_max, 'display_value': row[key], 'note': ''},
                )
                env_count += 1
            RegionalEnvironmentValue.objects.update_or_create(
                site=site, factor=factors['SOIL_TYPE'],
                defaults={'value_min': None, 'value_max': None, 'display_value': row['soil'], 'note': '土壤类型按区域试验点主要土类维护。'},
            )
            env_count += 1

        self.stdout.write(self.style.SUCCESS(f"亚麻区域地图数据写入完成：环境因子 {len(factors)} 个，地图点 {site_count} 个，品种关联 {variety_count} 个，环境值 {env_count} 条。"))
