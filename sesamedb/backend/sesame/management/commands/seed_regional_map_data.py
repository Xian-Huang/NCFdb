from decimal import Decimal

from django.core.management.base import BaseCommand
from django.db import transaction

from sesame.models import EnvironmentalFactor, Region, RegionalEnvironmentValue, RegionalMapSite, Variety

FACTORS = [
    {"code": "TEMP_AVG", "name": "生育期平均温度", "unit": "℃", "category": "温度", "description": "区域试验点生育期平均温度范围。"},
    {"code": "PRECIP_ANNUAL", "name": "年降水量", "unit": "mm", "category": "降水", "description": "区域试验点年降水量范围。"},
    {"code": "SUNSHINE_HOURS", "name": "年日照时数", "unit": "h", "category": "日照", "description": "区域试验点年日照时数范围。"},
    {"code": "SOIL_TYPE", "name": "土壤类型", "unit": "", "category": "土壤", "description": "区域试验点主要土壤类型。"},
]

SITES = [{'code': 'SES-MAP-GS', 'name': '甘肃陇东旱作高木酚素试验区', 'province': '甘肃省', 'region_code': 'CN-GS-SESAME', 'region_name': '甘肃陇东芝麻旱作区', 'climate': '温带半干旱气候', 'lng': '107.64000', 'lat': '35.73000', 'varieties': ['陇芝1号', '陇芝3号'], 'trait': '高木酚素与耐旱性', 'component': '芝麻素 4.8 mg/g，芝麻林素 2.1 mg/g', 'temperature': '9-12 ℃', 'precipitation': '350-520 mm', 'sunshine': '2450-2850 h', 'soil': '黄绵土 / 砂壤土'}, {'code': 'SES-MAP-HB', 'name': '湖北江汉平原高油分试验区', 'province': '湖北省', 'region_code': 'CN-HB-SESAME', 'region_name': '湖北江汉平原芝麻区', 'climate': '亚热带湿润季风气候', 'lng': '112.24000', 'lat': '30.67000', 'varieties': ['中芝13', '鄂芝6号'], 'trait': '高油分与稳产', 'component': '芝麻素 3.9 mg/g，芝麻林素 1.7 mg/g', 'temperature': '15-17 ℃', 'precipitation': '1050-1250 mm', 'sunshine': '1800-2100 h', 'soil': '潮土 / 水稻土'}, {'code': 'SES-MAP-HN', 'name': '河南豫南综合评价区', 'province': '河南省', 'region_code': 'CN-HN-SESAME', 'region_name': '河南豫南芝麻品质区', 'climate': '暖温带半湿润气候', 'lng': '114.07000', 'lat': '32.13000', 'varieties': ['豫芝11', '郑芝98N09'], 'trait': '抗病性与品质平衡', 'component': '芝麻素 4.2 mg/g，芝麻林素 1.9 mg/g', 'temperature': '14-16 ℃', 'precipitation': '800-1050 mm', 'sunshine': '1900-2300 h', 'soil': '黄褐土 / 砂姜黑土'}]

def parse_range(text):
    value = str(text).replace('℃', '').replace('mm', '').replace('h', '').strip()
    value = value.replace(' ', '')
    if '-' not in value:
        return None, None
    left, right = value.split('-', 1)
    return Decimal(left), Decimal(right)

class Command(BaseCommand):
    help = "写入芝麻区域优势品种与环境因子地图基础数据"

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
                    'description': f"芝麻区域优势品种与环境因子地图试验点。",
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

        self.stdout.write(self.style.SUCCESS(f"芝麻区域地图数据写入完成：环境因子 {len(factors)} 个，地图点 {site_count} 个，品种关联 {variety_count} 个，环境值 {env_count} 条。"))
