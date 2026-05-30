from django.core.management.base import BaseCommand
from perilla.models import (
    DownloadFile, Region, Variety, Gene, GeneExpression,
    EnvironmentalFactor, Institution, Announcement, News, Changelog
)

class Command(BaseCommand):
    help = 'Populate perilla database with sample data'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample data for PerillaDB...')
        
        DownloadFile.objects.all().delete()
        Region.objects.all().delete()
        Variety.objects.all().delete()
        Gene.objects.all().delete()
        GeneExpression.objects.all().delete()
        EnvironmentalFactor.objects.all().delete()
        Institution.objects.all().delete()
        Announcement.objects.all().delete()
        News.objects.all().delete()
        Changelog.objects.all().delete()

        download_files = [
            {
                'file_name': 'Perilla Reference Genome v1.0',
                'file_type': 'FASTA',
                'file_size': '1.1 GB',
                'description': 'High-quality reference genome assembly for perilla (Perilla frutescens)',
                'download_url': '#',
                'category': 'Genome',
                'version': 'v1.0',
                'is_published': True,
            },
            {
                'file_name': 'Perilla Genome Annotation v1.0',
                'file_type': 'GFF3',
                'file_size': '28 MB',
                'description': 'Comprehensive gene annotation for perilla reference genome',
                'download_url': '#',
                'category': 'Annotation',
                'version': 'v1.0',
                'is_published': True,
            },
            {
                'file_name': 'Perilla Transcriptome Data',
                'file_type': 'FASTQ',
                'file_size': '650 MB',
                'description': 'RNA-seq data from various perilla tissues and developmental stages',
                'download_url': '#',
                'category': 'Transcriptome',
                'version': 'v1.0',
                'is_published': True,
            },
            {
                'file_name': 'Perilla Rosmarinic Acid Data',
                'file_type': 'CSV',
                'file_size': '10 MB',
                'description': 'Comprehensive rosmarinic acid and flavonoid composition data',
                'download_url': '#',
                'category': 'Phenotype',
                'version': 'v1.0',
                'is_published': True,
            },
            {
                'file_name': 'Perilla Essential Oil Dataset',
                'file_type': 'CSV',
                'file_size': '8 MB',
                'description': 'Essential oil composition data from various perilla accessions',
                'download_url': '#',
                'category': 'Phenotype',
                'version': 'v1.0',
                'is_published': True,
            },
        ]
        
        for data in download_files:
            DownloadFile.objects.create(**data)
        self.stdout.write(f'Created {len(download_files)} download files')

        regions = [
            {'name': 'Jilin Province', 'code': 'JL', 'country': 'China', 'climate': 'Temperate', 'description': 'Major perilla producing province in China'},
            {'name': 'Liaoning Province', 'code': 'LN', 'country': 'China', 'climate': 'Temperate', 'description': 'Leading perilla cultivation area'},
            {'name': 'Heilongjiang Province', 'code': 'HLJ', 'country': 'China', 'climate': 'Cold temperate', 'description': 'Important perilla production region'},
            {'name': 'Japan', 'code': 'JPN', 'country': 'Japan', 'climate': 'Temperate', 'description': 'Traditional perilla (shiso) producer'},
            {'name': 'South Korea', 'code': 'KOR', 'country': 'South Korea', 'climate': 'Temperate', 'description': 'Major perilla consumer and producer'},
            {'name': 'India', 'code': 'IND', 'country': 'India', 'climate': 'Tropical', 'description': 'Perilla producing country in South Asia'},
            {'name': 'Vietnam', 'code': 'VNM', 'country': 'Vietnam', 'climate': 'Tropical', 'description': 'Southeast Asian perilla producer'},
            {'name': 'Thailand', 'code': 'THA', 'country': 'Thailand', 'climate': 'Tropical', 'description': 'Perilla used in Thai cuisine'},
        ]
        
        region_objs = []
        for data in regions:
            obj = Region.objects.create(**data)
            region_objs.append(obj)
        self.stdout.write(f'Created {len(regions)} regions')

        varieties = [
            {'name': 'Ziperilla 1', 'variety_code': 'ZP1', 'region': region_objs[0], 'seed_color': 'Brown', 'oil_content': 45.5, 'maturity_days': 120, 'yield_per_hectare': 2000, 'height': 150, 'description': 'High oil content variety developed in Jilin'},
            {'name': 'Black Perilla', 'variety_code': 'BKP', 'region': region_objs[1], 'seed_color': 'Black', 'oil_content': 42.0, 'maturity_days': 115, 'yield_per_hectare': 1800, 'height': 140, 'description': 'Traditional variety with high anthocyanin'},
            {'name': 'Green Perilla', 'variety_code': 'GRP', 'region': region_objs[2], 'seed_color': 'Brown', 'oil_content': 44.0, 'maturity_days': 110, 'yield_per_hectare': 1900, 'height': 145, 'description': 'Green leaf variety'},
            {'name': 'Shiso Ruby', 'variety_code': 'SRB', 'region': region_objs[3], 'seed_color': 'Brown', 'oil_content': 38.5, 'maturity_days': 90, 'yield_per_hectare': 1200, 'height': 80, 'description': 'Japanese red shiso variety'},
            {'name': 'Korean Perilla', 'variety_code': 'KRP', 'region': region_objs[4], 'seed_color': 'Brown', 'oil_content': 43.5, 'maturity_days': 100, 'yield_per_hectare': 1600, 'height': 130, 'description': 'Korean variety for leaf and oil'},
            {'name': 'Vietnam Perilla', 'variety_code': 'VNP', 'region': region_objs[5], 'seed_color': 'Brown', 'oil_content': 41.0, 'maturity_days': 95, 'yield_per_hectare': 1400, 'height': 120, 'description': 'Southeast Asian variety'},
        ]
        
        for data in varieties:
            Variety.objects.create(**data)
        self.stdout.write(f'Created {len(varieties)} varieties')

        genes = [
            {'gene_id': 'PFU1001', 'name': 'Perilla Oleosin', 'symbol': 'OLE', 'chromosome': '1', 'start_position': 1234567, 'end_position': 1245678, 'strand': '+', 'gene_type': 'CDS', 'function': 'Oil body formation', 'pathway': 'Lipid biosynthesis', 'description': 'Encodes oleosin protein involved in oil body formation'},
            {'gene_id': 'PFU1002', 'name': 'Perilla Fatty Acid Desaturase', 'symbol': 'FAD', 'chromosome': '2', 'start_position': 2345678, 'end_position': 2356789, 'strand': '+', 'gene_type': 'CDS', 'function': 'Omega-3 synthesis', 'pathway': 'Lipid biosynthesis', 'description': 'Key enzyme in ALA synthesis'},
            {'gene_id': 'PFU1003', 'name': 'Perilla Rosmarinic Acid Synthase', 'symbol': 'RAS', 'chromosome': '3', 'start_position': 3456789, 'end_position': 3467890, 'strand': '-', 'gene_type': 'CDS', 'function': 'Rosmarinic acid biosynthesis', 'pathway': 'Secondary metabolism', 'description': 'Key enzyme in rosmarinic acid synthesis'},
            {'gene_id': 'PFU1004', 'name': 'Perilla Anthocyanin Synthase', 'symbol': 'ANS', 'chromosome': '4', 'start_position': 4567890, 'end_position': 4578901, 'strand': '+', 'gene_type': 'CDS', 'function': 'Anthocyanin biosynthesis', 'pathway': 'Secondary metabolism', 'description': 'Involved in purple leaf coloration'},
            {'gene_id': 'PFU1005', 'name': 'Perilla Flowering Locus T', 'symbol': 'FT', 'chromosome': '5', 'start_position': 5678901, 'end_position': 5689012, 'strand': '+', 'gene_type': 'CDS', 'function': 'Flowering regulation', 'pathway': 'Developmental regulation', 'description': 'Flowering time gene'},
            {'gene_id': 'PFU1006', 'name': 'Perilla Drought Response', 'symbol': 'DRG', 'chromosome': '6', 'start_position': 6789012, 'end_position': 6799123, 'strand': '-', 'gene_type': 'CDS', 'function': 'Drought tolerance', 'pathway': 'Stress response', 'description': 'Involved in drought stress response'},
        ]
        
        for data in genes:
            Gene.objects.create(**data)
        self.stdout.write(f'Created {len(genes)} genes')

        institutions = [
            {'name': 'Jilin Academy of Agricultural Sciences', 'abbreviation': 'JLAAS', 'country': 'China', 'city': 'Changchun', 'address': 'No. 2688 Renmin Street', 'website': 'www.jlaas.cn', 'email': 'info@jlaas.cn', 'phone': '+86-431-86808201', 'contact_person': 'Dr. Wang Hong', 'description': 'Leading perilla research institution in China', 'institution_type': 'Research'},
            {'name': 'Liaoning Academy of Agricultural Sciences', 'abbreviation': 'LNAAS', 'country': 'China', 'city': 'Shenyang', 'address': 'No. 88 Wenhua Road', 'website': 'www.lnaas.cn', 'email': 'lnaas@lnaas.cn', 'phone': '+86-24-88487156', 'contact_person': 'Dr. Li Jing', 'description': 'Perilla research in Liaoning', 'institution_type': 'Research'},
            {'name': 'Japan Agricultural Research Center', 'abbreviation': 'JARC', 'country': 'Japan', 'city': 'Tsukuba', 'address': '1-2-1 Kannondai', 'website': 'www.jarc.go.jp', 'email': 'info@jarc.go.jp', 'phone': '+81-29-838-7401', 'contact_person': 'Dr. Tanaka Yuki', 'description': 'Shiso research in Japan', 'institution_type': 'Research'},
        ]
        
        for data in institutions:
            Institution.objects.create(**data)
        self.stdout.write(f'Created {len(institutions)} institutions')

        news_data = [
            {
                'title': '高油分紫苏育种材料完成入库',
                'content': '<p>吉林冷凉区筛选的高油分紫苏材料已完成数据库登记。该材料在早春低温条件下出苗整齐，群体恢复能力较好，适合作为籽粒油分和脂肪酸组成评价的代表材料。</p><p>PerillaDB 已整理其脂肪酸谱、冷凉区试验地点、亲本来源和区域表现信息，后续将继续补充芳香代谢物和分子标记数据。</p>',
                'author': '王红',
                'category': '研究进展',
                'tags': '育种,油分,紫苏',
                'views': 720,
                'is_published': True,
                'publish_time': '2026-03-15',
                'image': 'news_images/perilla-cold-climate-variety.png',
            },
            {
                'title': '2026紫苏功能成分研究交流会通知',
                'content': '<p>2026年紫苏功能成分研究交流会将围绕叶片芳香代谢物、籽粒油分营养、种质驯化和区域适应性展开讨论。</p><p>PerillaDB 团队将演示种质整理、代谢物表格、区域地图和可视化工作流，支持合作项目按统一标准提交中文数据。</p>',
                'author': '项目办公室',
                'category': '活动',
                'tags': '会议,紫苏,功能成分',
                'views': 520,
                'is_published': True,
                'publish_time': '2026-03-10',
                'image': 'news_images/perilla-symposium-2026.png',
            },
            {
                'title': '紫苏参考基因组与候选基因注释更新',
                'content': '<p>紫苏参考基因组数据已更新，新增萜类合成酶候选基因、脂肪酸通路基因和染色体浏览轨道。</p><p>下载包已按原始注释、整理后的基因家族和表达分析用特征表进行区分，便于用户开展后续比较分析。</p>',
                'author': '基因组团队',
                'category': '研究进展',
                'tags': '基因组,注释,发布',
                'views': 1180,
                'is_published': True,
                'publish_time': '2026-02-28',
                'image': 'news_images/perilla-genome-release.png',
            },
        ]
        
        for data in news_data:
            News.objects.create(**data)
        self.stdout.write(f'Created {len(news_data)} news articles')

        changelogs = [
            {
                'version': '1.0.0',
                'title': 'PerillaDB v1.0 初始版本发布',
                'content': 'PerillaDB 初始版本已上线，提供紫苏参考基因组、基础注释、种质信息、功能成分和数据下载入口。',
                'changes': ['数据库初始发布', '参考基因组 v1.0', '基础基因注释', '基因组浏览器', '数据下载入口'],
                'release_date': '2026-03-01',
                'is_published': True,
            },
        ]
        
        for data in changelogs:
            Changelog.objects.create(**data)
        self.stdout.write(f'Created {len(changelogs)} changelog entries')

        announcements = [
            {
                'title': '欢迎使用 PerillaDB',
                'content': 'PerillaDB 已上线运行，面向紫苏基因组、芳香代谢物、籽粒油分和育种资源提供统一查询与下载服务。',
                'announcement_type': '通知',
                'author': '系统管理员',
                'importance': 'high',
                'is_published': True,
                'publish_date': '2026-03-20',
            },
        ]
        
        for data in announcements:
            Announcement.objects.create(**data)
        self.stdout.write(f'Created {len(announcements)} announcements')

        self.stdout.write(self.style.SUCCESS('Successfully populated PerillaDB with sample data!'))
