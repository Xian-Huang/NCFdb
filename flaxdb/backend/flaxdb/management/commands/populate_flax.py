from django.core.management.base import BaseCommand
from flaxdb.models import (
    DownloadFile, Region, Variety, Gene, GeneExpression,
    EnvironmentalFactor, Institution, Announcement, News, Changelog
)

class Command(BaseCommand):
    help = 'Populate flax database with sample data'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample data for FlaxDB...')
        
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
                'file_name': 'Flax Reference Genome v1.0',
                'file_type': 'FASTA',
                'file_size': '1.5 GB',
                'description': 'High-quality reference genome assembly for flax (Linum usitatissimum)',
                'download_url': '#',
                'category': 'Genome',
                'version': 'v1.0',
                'is_published': True,
            },
            {
                'file_name': 'Flax Genome Annotation v1.0',
                'file_type': 'GFF3',
                'file_size': '38 MB',
                'description': 'Comprehensive gene annotation for flax reference genome',
                'download_url': '#',
                'category': 'Annotation',
                'version': 'v1.0',
                'is_published': True,
            },
            {
                'file_name': 'Flax Transcriptome Data',
                'file_type': 'FASTQ',
                'file_size': '920 MB',
                'description': 'RNA-seq data from various flax tissues and developmental stages',
                'download_url': '#',
                'category': 'Transcriptome',
                'version': 'v1.0',
                'is_published': True,
            },
            {
                'file_name': 'Flax SNP Dataset',
                'file_type': 'VCF',
                'file_size': '280 MB',
                'description': 'Genome-wide SNP variants from 1000 flax accessions',
                'download_url': '#',
                'category': 'Variation',
                'version': 'v1.0',
                'is_published': True,
            },
            {
                'file_name': 'Flax Omega-3 Fatty Acid Data',
                'file_type': 'CSV',
                'file_size': '15 MB',
                'description': 'Comprehensive fatty acid composition data for flax breeding',
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
            {'name': 'Heilongjiang Province', 'code': 'HLJ', 'country': 'China', 'climate': 'Temperate', 'description': 'Major flax producing province in China'},
            {'name': 'Jilin Province', 'code': 'JL', 'country': 'China', 'climate': 'Temperate', 'description': 'Leading flax cultivation area'},
            {'name': 'Inner Mongolia', 'code': 'NM', 'country': 'China', 'climate': 'Temperate', 'description': 'Important flax fiber production region'},
            {'name': 'Canada', 'code': 'CAN', 'country': 'Canada', 'climate': 'Temperate', 'description': 'World largest flax producer'},
            {'name': 'Russia', 'code': 'RUS', 'country': 'Russia', 'climate': 'Cold temperate', 'description': 'Major flax producer in Europe'},
            {'name': 'France', 'code': 'FRA', 'country': 'France', 'climate': 'Temperate', 'description': 'Leading flax fiber producer in EU'},
            {'name': 'Kazakhstan', 'code': 'KAZ', 'country': 'Kazakhstan', 'climate': 'Continental', 'description': 'Major flax exporter in Central Asia'},
            {'name': 'India', 'code': 'IND', 'country': 'India', 'climate': 'Subtropical', 'description': 'Important linseed producing country'},
        ]
        
        region_objs = []
        for data in regions:
            obj = Region.objects.create(**data)
            region_objs.append(obj)
        self.stdout.write(f'Created {len(regions)} regions')

        varieties = [
            {'name': 'Heiya 1', 'variety_code': 'HY1', 'region': region_objs[0], 'seed_color': 'Brown', 'oil_content': 40.5, 'maturity_days': 110, 'yield_per_hectare': 1800, 'height': 90, 'description': 'High oil content variety developed in China'},
            {'name': 'Delta', 'variety_code': 'DLT', 'region': region_objs[3], 'seed_color': 'Yellow', 'oil_content': 42.0, 'maturity_days': 100, 'yield_per_hectare': 2200, 'height': 85, 'description': 'Canadian high-yielding variety'},
            {'name': 'Atlas', 'variety_code': 'ATL', 'region': region_objs[3], 'seed_color': 'Brown', 'oil_content': 41.5, 'maturity_days': 105, 'yield_per_hectare': 2100, 'height': 88, 'description': 'Canadian premium variety'},
            {'name': 'Nike', 'variety_code': 'NKE', 'region': region_objs[4], 'seed_color': 'Brown', 'oil_content': 39.8, 'maturity_days': 115, 'yield_per_hectare': 1900, 'height': 95, 'description': 'Russian variety with high adaptability'},
            {'name': 'Hermes', 'variety_code': 'HRM', 'region': region_objs[5], 'seed_color': 'Yellow', 'oil_content': 38.5, 'maturity_days': 95, 'yield_per_hectare': 2000, 'height': 80, 'description': 'French fiber flax variety'},
            {'name': 'Aliz', 'variety_code': 'ALZ', 'region': region_objs[6], 'seed_color': 'Brown', 'oil_content': 40.0, 'maturity_days': 108, 'yield_per_hectare': 1700, 'height': 92, 'description': 'Kazakhstan variety'},
        ]
        
        for data in varieties:
            Variety.objects.create(**data)
        self.stdout.write(f'Created {len(varieties)} varieties')

        genes = [
            {'gene_id': 'LUS1001', 'name': 'Flax Oleosin', 'symbol': 'OLE', 'chromosome': '1', 'start_position': 1234567, 'end_position': 1245678, 'strand': '+', 'gene_type': 'CDS', 'function': 'Oil body formation', 'pathway': 'Lipid biosynthesis', 'description': 'Encodes oleosin protein involved in oil body formation'},
            {'gene_id': 'LUS1002', 'name': 'Flax Fatty Acid Desaturase', 'symbol': 'FAD', 'chromosome': '2', 'start_position': 2345678, 'end_position': 2356789, 'strand': '+', 'gene_type': 'CDS', 'function': 'Omega-3 synthesis', 'pathway': 'Lipid biosynthesis', 'description': 'Key enzyme in ALA synthesis'},
            {'gene_id': 'LUS1003', 'name': 'Flax CELLULOSE SYNTHASE', 'symbol': 'CesA', 'chromosome': '3', 'start_position': 3456789, 'end_position': 3467890, 'strand': '-', 'gene_type': 'CDS', 'function': 'Fiber cell wall synthesis', 'pathway': 'Cell wall biosynthesis', 'description': 'Involved in fiber quality'},
            {'gene_id': 'LUS1004', 'name': 'Flax Lignan Synthase', 'symbol': 'LGS', 'chromosome': '4', 'start_position': 4567890, 'end_position': 4578901, 'strand': '+', 'gene_type': 'CDS', 'function': 'Lignan biosynthesis', 'pathway': 'Secondary metabolism', 'description': 'Key enzyme in secoisolariciresinol synthesis'},
            {'gene_id': 'LUS1005', 'name': 'Flax Drought Response', 'symbol': 'DRG', 'chromosome': '5', 'start_position': 5678901, 'end_position': 5689012, 'strand': '+', 'gene_type': 'CDS', 'function': 'Drought tolerance', 'pathway': 'Stress response', 'description': 'Involved in drought stress response'},
            {'gene_id': 'LUS1006', 'name': 'Flax Flowering Locus T', 'symbol': 'FT', 'chromosome': '6', 'start_position': 6789012, 'end_position': 6799123, 'strand': '-', 'gene_type': 'CDS', 'function': 'Flowering regulation', 'pathway': 'Developmental regulation', 'description': 'Flowering time gene'},
        ]
        
        for data in genes:
            Gene.objects.create(**data)
        self.stdout.write(f'Created {len(genes)} genes')

        institutions = [
            {'name': 'Heilongjiang Academy of Agricultural Sciences', 'abbreviation': 'HAAS', 'country': 'China', 'city': 'Harbin', 'address': 'No. 368 Xuefu Road', 'website': 'www.haas.cn', 'email': 'info@haas.cn', 'phone': '+86-451-86680114', 'contact_person': 'Dr. Li Wei', 'description': 'Leading flax research institution in China', 'institution_type': 'Research'},
            {'name': 'Canada-Saskatchewan Pulse Growers', 'abbreviation': 'CSPG', 'country': 'Canada', 'city': 'Saskatoon', 'address': '2221 Cornwall Street', 'website': 'www.saskpulse.ca', 'email': 'info@saskpulse.ca', 'phone': '+1-306-668-5556', 'contact_person': 'Dr. John Smith', 'description': 'Flax research and development in Canada', 'institution_type': 'Research'},
            {'name': 'Institute of Bast Fiber Crops', 'abbreviation': 'IBFC', 'country': 'China', 'city': 'Nanjing', 'address': 'No. 50 Xiaolingwei Street', 'website': 'www.ibfc.cn', 'email': 'ibfc@caas.cn', 'phone': '+86-25-84390345', 'contact_person': 'Dr. Wang Min', 'description': 'Research institute for flax and hemp', 'institution_type': 'Research'},
        ]
        
        for data in institutions:
            Institution.objects.create(**data)
        self.stdout.write(f'Created {len(institutions)} institutions')

        news_data = [
            {
                'title': '高α-亚麻酸亚麻新品系完成入库',
                'content': '<p>黑龙江冷凉区筛选的高α-亚麻酸亚麻材料已完成数据库入库。该材料兼顾籽粒油分、抗倒伏表现和冷凉春播条件下的结实稳定性，可作为区域营养品质评价和育种材料比较的重点对象。</p><p>FlaxDB 已同步整理其亲本来源、区域试验点、脂肪酸组成、样品批次和相关分子标记信息。后续将继续补充多年度检测数据，支撑高不饱和脂肪酸材料的稳定性分析。</p>',
                'author': '李伟',
                'category': '研究进展',
                'tags': '育种,α-亚麻酸,新品种',
                'views': 980,
                'is_published': True,
                'publish_time': '2026-03-15',
                'image': 'news_images/flax-ala-variety.png',
            },
            {
                'title': '2026亚麻功能成分与种质资源会议通知',
                'content': '<p>2026年亚麻功能成分与种质资源专题会议将围绕纤维品质、籽粒营养、区域适应性和比较基因组学展开交流。会议设置数据库建设、样品采集标准和数据共享规范等专题。</p><p>FlaxDB 团队将展示种质记录、试验地点、营养指标和基因组浏览器之间的关联流程，帮助合作单位以统一格式提交可复用数据。</p>',
                'author': '项目办公室',
                'category': '活动',
                'tags': '会议,亚麻,数据共享',
                'views': 720,
                'is_published': True,
                'publish_time': '2026-03-10',
                'image': 'news_images/flax-conference-2026.png',
            },
            {
                'title': '亚麻参考基因组与注释数据更新',
                'content': '<p>亚麻参考基因组装和注释数据已完成更新，新增染色体级别序列、基因模型、重复序列注释和可下载的功能注释表。</p><p>新版浏览轨道补充了基因密度、油脂合成候选基因和已整理的QTL区间。用户可在数据中心下载相关文件，并结合营养性状表进行交叉查询。</p>',
                'author': '基因组团队',
                'category': '研究进展',
                'tags': '基因组,注释,发布',
                'views': 1650,
                'is_published': True,
                'publish_time': '2026-02-28',
                'image': 'news_images/flax-genome-release.png',
            },
        ]
        
        for data in news_data:
            News.objects.create(**data)
        self.stdout.write(f'Created {len(news_data)} news articles')

        changelogs = [
            {
                'version': '1.0.0',
                'title': 'FlaxDB v1.0 初始版本发布',
                'content': 'FlaxDB 初始版本已上线，提供亚麻参考基因组、基础注释、种质信息、营养性状和数据下载入口。',
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
                'title': '欢迎使用 FlaxDB',
                'content': 'FlaxDB 已上线运行，面向亚麻基因组、营养品质、区域种质和育种资源提供统一查询与下载服务。',
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

        self.stdout.write(self.style.SUCCESS('Successfully populated FlaxDB with sample data!'))
