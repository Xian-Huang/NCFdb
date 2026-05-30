from decimal import Decimal

from django.core.management.base import BaseCommand
from django.db import transaction

from safflower.models import EnvironmentalFactor, Region, RegionalEnvironmentValue, RegionalMapSite, Variety

FACTORS = [
    {"code": "TEMP_AVG", "name": "生育期平均温度", "unit": "℃", "category": "温度", "description": "区域试验点生育期平均温度范围。"},
    {"code": "PRECIP_ANNUAL", "name": "年降水量", "unit": "mm", "category": "降水", "description": "区域试验点年降水量范围。"},
    {"code": "SUNSHINE_HOURS", "name": "年日照时数", "unit": "h", "category": "日照", "description": "区域试验点年日照时数范围。"},
    {"code": "SOIL_TYPE", "name": "土壤类型", "unit": "", "category": "土壤", "description": "区域试验点主要土壤类型。"},
]

SITES = [{'code': 'SAFF-MAP-XJ', 'name': '新疆干旱绿洲高油酸试验区', 'province': '新疆维吾尔自治区', 'region_code': 'CN-XJ-SAFF', 'region_name': '新疆红花干旱绿洲区', 'climate': '温带大陆性干旱气候', 'lng': '87.62000', 'lat': '43.82000', 'varieties': ['新红花5号', '裕民无刺'], 'trait': '高油酸与耐旱', 'component': '油酸 76.4%，羟基红花黄色素A 1.6%', 'temperature': '6-9 ℃', 'precipitation': '150-300 mm', 'sunshine': '2800-3200 h', 'soil': '灰漠土 / 灌淤土'}, {'code': 'SAFF-MAP-YN', 'name': '云南高原花色评价区', 'province': '云南省', 'region_code': 'CN-YN-SAFF', 'region_name': '云南高原红花药用品质区', 'climate': '低纬高原季风气候', 'lng': '102.71000', 'lat': '25.04000', 'varieties': ['云红花3号', '滇红花地方种'], 'trait': '花色素与药用成分', 'component': '羟基红花黄色素A 2.1%，总黄酮 18.5 mg/g', 'temperature': '14-17 ℃', 'precipitation': '850-1050 mm', 'sunshine': '2100-2400 h', 'soil': '红壤'}, {'code': 'SAFF-MAP-GS', 'name': '甘肃河西耐旱评价点', 'province': '甘肃省', 'region_code': 'CN-GS-SAFF', 'region_name': '甘肃河西红花旱作区', 'climate': '温带干旱气候', 'lng': '100.45000', 'lat': '38.93000', 'varieties': ['甘红1号', '河西红花'], 'trait': '旱作稳产与早熟', 'component': '油分 31.8%，亚油酸 68.2%', 'temperature': '7-10 ℃', 'precipitation': '120-250 mm', 'sunshine': '2850-3150 h', 'soil': '灌漠土 / 砂壤土'}]

def parse_range(text):
    value = str(text).replace('℃', '').replace('mm', '').replace('h', '').strip()
    value = value.replace(' ', '')
    if '-' not in value:
        return None, None
    left, right = value.split('-', 1)
    return Decimal(left), Decimal(right)

class Command(BaseCommand):
    help = "写入红花区域优势品种与环境因子地图基础数据"

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
                    'description': f"红花区域优势品种与环境因子地图试验点。",
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

        self.stdout.write(self.style.SUCCESS(f"红花区域地图数据写入完成：环境因子 {len(factors)} 个，地图点 {site_count} 个，品种关联 {variety_count} 个，环境值 {env_count} 条。"))
