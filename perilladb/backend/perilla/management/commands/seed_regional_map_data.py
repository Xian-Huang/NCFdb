from decimal import Decimal

from django.core.management.base import BaseCommand
from django.db import transaction

from perilla.models import EnvironmentalFactor, Region, RegionalEnvironmentValue, RegionalMapSite, Variety

FACTORS = [
    {"code": "TEMP_AVG", "name": "生育期平均温度", "unit": "℃", "category": "温度", "description": "区域试验点生育期平均温度范围。"},
    {"code": "PRECIP_ANNUAL", "name": "年降水量", "unit": "mm", "category": "降水", "description": "区域试验点年降水量范围。"},
    {"code": "SUNSHINE_HOURS", "name": "年日照时数", "unit": "h", "category": "日照", "description": "区域试验点年日照时数范围。"},
    {"code": "SOIL_TYPE", "name": "土壤类型", "unit": "", "category": "土壤", "description": "区域试验点主要土壤类型。"},
]

SITES = [{'code': 'PERILLA-MAP-JL', 'name': '吉林冷凉区紫苏资源圃', 'province': '吉林省', 'region_code': 'CN-JL-PERILLA', 'region_name': '吉林冷凉紫苏区', 'climate': '温带季风气候', 'lng': '125.32000', 'lat': '43.90000', 'varieties': ['吉苏1号', '白苏地方种'], 'trait': '高油分与冷凉适应', 'component': 'α-亚麻酸 58.6%，总油分 43.2%', 'temperature': '4-7 ℃', 'precipitation': '550-750 mm', 'sunshine': '2300-2600 h', 'soil': '黑土'}, {'code': 'PERILLA-MAP-GZ', 'name': '贵州山地芳香型评价区', 'province': '贵州省', 'region_code': 'CN-GZ-PERILLA', 'region_name': '贵州山地芳香紫苏区', 'climate': '亚热带湿润山地气候', 'lng': '106.63000', 'lat': '26.65000', 'varieties': ['黔苏2号', '紫叶香苏'], 'trait': '芳香代谢物与叶用性状', 'component': '紫苏醛 1.8%，迷迭香酸 4.5 mg/g', 'temperature': '14-17 ℃', 'precipitation': '1050-1250 mm', 'sunshine': '1200-1600 h', 'soil': '黄壤'}, {'code': 'PERILLA-MAP-SC', 'name': '四川盆地叶用品质试验点', 'province': '四川省', 'region_code': 'CN-SC-PERILLA', 'region_name': '四川盆地叶用紫苏区', 'climate': '亚热带湿润气候', 'lng': '104.06000', 'lat': '30.67000', 'varieties': ['川苏1号', '绿叶香苏'], 'trait': '叶用产量与挥发油', 'component': '挥发油 0.68%，迷迭香酸 3.9 mg/g', 'temperature': '15-18 ℃', 'precipitation': '900-1150 mm', 'sunshine': '1100-1500 h', 'soil': '紫色土 / 壤土'}]

def parse_range(text):
    value = str(text).replace('℃', '').replace('mm', '').replace('h', '').strip()
    value = value.replace(' ', '')
    if '-' not in value:
        return None, None
    left, right = value.split('-', 1)
    return Decimal(left), Decimal(right)

class Command(BaseCommand):
    help = "写入紫苏区域优势品种与环境因子地图基础数据"

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
                    'description': f"紫苏区域优势品种与环境因子地图试验点。",
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

        self.stdout.write(self.style.SUCCESS(f"紫苏区域地图数据写入完成：环境因子 {len(factors)} 个，地图点 {site_count} 个，品种关联 {variety_count} 个，环境值 {env_count} 条。"))
