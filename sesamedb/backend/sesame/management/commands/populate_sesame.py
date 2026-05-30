from django.core.management.base import BaseCommand
from sesame.models import (
    DownloadFile, Region, Variety, Gene, GeneExpression,
    EnvironmentalFactor, Institution, Announcement, News, Changelog
)

class Command(BaseCommand):
    help = 'Populate sesame database with sample data'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample data for SesameDB...')
        
        # Clear existing data
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

        # Download Files
        download_files = [
            {
                'file_name': 'Sesame Reference Genome v2.0',
                'file_type': 'FASTA',
                'file_size': '1.2 GB',
                'description': 'High-quality reference genome assembly for sesame (Sesamum indicum L.) version 2.0',
                'download_url': '#',
                'category': 'Genome',
                'version': 'v2.0',
                'is_published': True,
            },
            {
                'file_name': 'Sesame Genome Annotation v2.0',
                'file_type': 'GFF3',
                'file_size': '45 MB',
                'description': 'Comprehensive gene annotation for sesame reference genome v2.0',
                'download_url': '#',
                'category': 'Annotation',
                'version': 'v2.0',
                'is_published': True,
            },
            {
                'file_name': 'Sesame Transcriptome Data',
                'file_type': 'FASTQ',
                'file_size': '850 MB',
                'description': 'RNA-seq data from various sesame tissues and developmental stages',
                'download_url': '#',
                'category': 'Transcriptome',
                'version': 'v1.0',
                'is_published': True,
            },
            {
                'file_name': 'Sesame SNP Dataset',
                'file_type': 'VCF',
                'file_size': '320 MB',
                'description': 'Genome-wide SNP variants from 1000 sesame accessions',
                'download_url': '#',
                'category': 'Variation',
                'version': 'v1.0',
                'is_published': True,
            },
            {
                'file_name': 'Sesame Phenotyping Data',
                'file_type': 'CSV',
                'file_size': '25 MB',
                'description': 'Comprehensive phenotypic data for sesame breeding populations',
                'download_url': '#',
                'category': 'Phenotype',
                'version': 'v1.0',
                'is_published': True,
            },
        ]
        
        for data in download_files:
            DownloadFile.objects.create(**data)
        self.stdout.write(f'Created {len(download_files)} download files')

        # Regions
        regions = [
            {'name': 'Henan Province', 'code': 'HEN', 'country': 'China', 'climate': 'Temperate', 'description': 'Major sesame producing province in China'},
            {'name': 'Shandong Province', 'code': 'SD', 'country': 'China', 'climate': 'Temperate', 'description': 'Second largest sesame producer in China'},
            {'name': 'Jiangsu Province', 'code': 'JS', 'country': 'China', 'climate': 'Subtropical', 'description': 'Leading sesame breeding research center'},
            {'name': 'Anhui Province', 'code': 'AH', 'country': 'China', 'climate': 'Subtropical', 'description': 'Important sesame cultivation area'},
            {'name': 'Hubei Province', 'code': 'HB', 'country': 'China', 'climate': 'Subtropical', 'description': 'Major sesame producing region'},
            {'name': 'Sichuan Province', 'code': 'SC', 'country': 'China', 'climate': 'Subtropical', 'description': 'Traditional sesame growing area'},
            {'name': 'India', 'code': 'IND', 'country': 'India', 'climate': 'Tropical', 'description': 'World largest sesame producer'},
            {'name': 'Myanmar', 'code': 'MMR', 'country': 'Myanmar', 'climate': 'Tropical', 'description': 'Major sesame exporter'},
            {'name': 'Sudan', 'code': 'SDN', 'country': 'Sudan', 'climate': 'Tropical', 'description': 'Leading sesame producer in Africa'},
            {'name': 'Nigeria', 'code': 'NGA', 'country': 'Nigeria', 'climate': 'Tropical', 'description': 'Major sesame producer in West Africa'},
        ]
        
        region_objs = []
        for data in regions:
            obj = Region.objects.create(**data)
            region_objs.append(obj)
        self.stdout.write(f'Created {len(regions)} regions')

        # Varieties
        varieties = [
            {'name': 'Zhongzhi 1', 'variety_code': 'ZZ1', 'region': region_objs[0], 'seed_color': 'White', 'oil_content': 56.8, 'maturity_days': 120, 'yield_per_hectare': 2500, 'height': 150, 'description': 'High oil content variety developed by CAAS'},
            {'name': 'Yuzhi 4', 'variety_code': 'YZ4', 'region': region_objs[1], 'seed_color': 'Black', 'oil_content': 54.2, 'maturity_days': 110, 'yield_per_hectare': 2800, 'height': 140, 'description': 'Early maturing variety'},
            {'name': 'Mianzhi 11', 'variety_code': 'MZ11', 'region': region_objs[2], 'seed_color': 'White', 'oil_content': 55.5, 'maturity_days': 115, 'yield_per_hectare': 2650, 'height': 145, 'description': 'High yielding variety'},
            {'name': 'Wanxian Bai', 'variety_code': 'WXB', 'region': region_objs[5], 'seed_color': 'White', 'oil_content': 53.8, 'maturity_days': 125, 'yield_per_hectare': 2400, 'height': 160, 'description': 'Traditional local variety'},
            {'name': 'Sesame 53', 'variety_code': 'S53', 'region': region_objs[6], 'seed_color': 'Brown', 'oil_content': 52.5, 'maturity_days': 90, 'yield_per_hectare': 1200, 'height': 100, 'description': 'Indian improved variety'},
            {'name': 'Punjab Til 1', 'variety_code': 'PT1', 'region': region_objs[6], 'seed_color': 'White', 'oil_content': 55.0, 'maturity_days': 85, 'yield_per_hectare': 1100, 'height': 95, 'description': 'Early maturing Indian variety'},
            {'name': 'Tainan 2', 'variety_code': 'TN2', 'region': region_objs[7], 'seed_color': 'Black', 'oil_content': 54.0, 'maturity_days': 100, 'yield_per_hectare': 900, 'height': 120, 'description': 'Myanmar local variety'},
            {'name': 'Kaffa', 'variety_code': 'KAF', 'region': region_objs[8], 'seed_color': 'White', 'oil_content': 50.0, 'maturity_days': 130, 'yield_per_hectare': 800, 'height': 180, 'description': 'Sudanese local variety'},
        ]
        
        for data in varieties:
            Variety.objects.create(**data)
        self.stdout.write(f'Created {len(varieties)} varieties')

        # Genes
        genes = [
            {'gene_id': 'SIN1001', 'name': 'Sesame Oleosin', 'symbol': 'OLE', 'chromosome': '1', 'start_position': 1234567, 'end_position': 1245678, 'strand': '+', 'gene_type': 'CDS', 'function': 'Oil body formation', 'pathway': 'Lipid biosynthesis', 'description': 'Encodes oleosin protein involved in oil body formation'},
            {'gene_id': 'SIN1002', 'name': 'Sesame Stearoyl-ACP', 'symbol': 'SAC', 'chromosome': '2', 'start_position': 2345678, 'end_position': 2356789, 'strand': '+', 'gene_type': 'CDS', 'function': 'Fatty acid synthesis', 'pathway': 'Lipid biosynthesis', 'description': 'Key enzyme in fatty acid biosynthesis'},
            {'gene_id': 'SIN1003', 'name': 'Sesame Diacylglycerol', 'symbol': 'DAG', 'chromosome': '3', 'start_position': 3456789, 'end_position': 3467890, 'strand': '-', 'gene_type': 'CDS', 'function': 'Triacylglycerol synthesis', 'pathway': 'Lipid biosynthesis', 'description': 'Involved in TAG biosynthesis'},
            {'gene_id': 'SIN1004', 'name': 'Sesame LIPOXYGENASE', 'symbol': 'LOX', 'chromosome': '4', 'start_position': 4567890, 'end_position': 4578901, 'strand': '+', 'gene_type': 'CDS', 'function': 'Flavor development', 'pathway': 'Secondary metabolism', 'description': 'Involved in flavor compound synthesis'},
            {'gene_id': 'SIN1005', 'name': 'Sesame SESAMINE', 'symbol': 'SES', 'chromosome': '5', 'start_position': 5678901, 'end_position': 5689012, 'strand': '+', 'gene_type': 'CDS', 'function': 'Lignan biosynthesis', 'pathway': 'Secondary metabolism', 'description': 'Key enzyme in sesamin synthesis'},
            {'gene_id': 'SIN1006', 'name': 'Sesame Flowering Locus T', 'symbol': 'FT', 'chromosome': '6', 'start_position': 6789012, 'end_position': 6799123, 'strand': '-', 'gene_type': 'CDS', 'function': 'Flowering regulation', 'pathway': 'Developmental regulation', 'description': 'Flowering time gene'},
            {'gene_id': 'SIN1007', 'name': 'Sesame drought stress protein', 'symbol': 'DSP', 'chromosome': '7', 'start_position': 7890123, 'end_position': 7901234, 'strand': '+', 'gene_type': 'CDS', 'function': 'Drought tolerance', 'pathway': 'Stress response', 'description': 'Involved in drought stress response'},
            {'gene_id': 'SIN1008', 'name': 'Sesame oil content QTL', 'symbol': 'OCQ', 'chromosome': '8', 'start_position': 8901234, 'end_position': 8912345, 'strand': '+', 'gene_type': 'QTL', 'function': 'Oil content regulation', 'pathway': 'Lipid biosynthesis', 'description': 'Major QTL for oil content'},
        ]
        
        for data in genes:
            Gene.objects.create(**data)
        self.stdout.write(f'Created {len(genes)} genes')

        # Institutions
        institutions = [
            {'name': 'Chinese Academy of Agricultural Sciences', 'abbreviation': 'CAAS', 'country': 'China', 'city': 'Beijing', 'address': 'No. 12 Zhongguancun South Street', 'website': 'www.caas.cn', 'email': 'info@caas.cn', 'phone': '+86-10-82105588', 'contact_person': 'Dr. Wang Wei', 'description': 'Leading agricultural research institution in China', 'institution_type': 'Research'},
            {'name': 'Institute of Crop Sciences', 'abbreviation': 'ICS', 'country': 'China', 'city': 'Beijing', 'address': 'No. 12 Zhongguancun South Street', 'website': 'ics.caas.cn', 'email': 'ics@caas.cn', 'phone': '+86-10-62186789', 'contact_person': 'Dr. Li Ming', 'description': 'Crop science research institute', 'institution_type': 'Research'},
            {'name': 'National Sesame Improvement Center', 'abbreviation': 'NSIC', 'country': 'China', 'city': 'Zhengzhou', 'address': 'Henan Academy of Agricultural Sciences', 'website': 'www.nsic.org.cn', 'email': 'nsic@sesame.org.cn', 'phone': '+86-371-65712345', 'contact_person': 'Dr. Zhang Hong', 'description': 'National center for sesame improvement', 'institution_type': 'Research'},
            {'name': 'ICAR-Indian Institute of Oilseeds Research', 'abbreviation': 'IIOR', 'country': 'India', 'city': 'Hyderabad', 'address': 'Rajendranagar', 'website': 'www.iior.org.in', 'email': 'director@iior.org.in', 'phone': '+91-40-24015345', 'contact_person': 'Dr. Sharma R', 'description': 'Premier oilseeds research institute in India', 'institution_type': 'Research'},
            {'name': 'Sudan Sesame Research Center', 'abbreviation': 'SSRC', 'country': 'Sudan', 'city': 'Khartoum', 'address': 'Agricultural Research Corporation', 'website': 'www.ssrc.sd', 'email': 'info@ssrc.sd', 'phone': '+249-183-481234', 'contact_person': 'Dr. Ahmed Mohamed', 'description': 'Sesame research center in Sudan', 'institution_type': 'Research'},
        ]
        
        for data in institutions:
            Institution.objects.create(**data)
        self.stdout.write(f'Created {len(institutions)} institutions')

        # News
        news_data = [
            {
                'title': '高油分芝麻新品种完成数据库登记',
                'content': '<p>国家芝麻改良中心筛选的高油分芝麻新品种已完成数据库登记。该材料含油量超过58%，在多点区域试验中表现出较好的适应性和产量稳定性。</p><p>数据库已整理其亲本来源、区域试验记录、油分和木酚素检测结果，并与后续分子指纹图谱框架预留字段保持一致。</p>',
                'author': '张红',
                'category': '研究进展',
                'tags': '育种,油分,新品种',
                'views': 1250,
                'is_published': True,
                'publish_time': '2026-03-15',
                'image': 'news_images/sesame-high-oil-variety.png',
            },
            {
                'title': '2026芝麻基因组学与营养品质会议通知',
                'content': '<p>2026年芝麻基因组学与营养品质会议将在北京举办，围绕芝麻基因组资源、功能成分、区域试验和育种应用展开交流。</p><p>会议重点包括芝麻参考基因组 v2.0、木酚素含量差异、区域环境因子和数据库共享数据规范。</p>',
                'author': '项目办公室',
                'category': '活动',
                'tags': '会议,芝麻,基因组',
                'views': 890,
                'is_published': True,
                'publish_time': '2026-03-10',
                'image': 'news_images/sesame-consortium-meeting.png',
            },
            {
                'title': '芝麻参考基因组 v2.0 数据发布',
                'content': '<p>芝麻参考基因组 v2.0 已完成发布。新版组装在连续性和完整性方面明显提升，染色体级别序列覆盖率进一步提高。</p><p>新版注释包含高可信基因模型、功能注释和候选通路信息，可与油分、木酚素、区域环境因子等数据库记录联合查询。</p>',
                'author': '基因组团队',
                'category': '研究进展',
                'tags': '基因组,注释,发布',
                'views': 2100,
                'is_published': True,
                'publish_time': '2026-02-28',
                'image': 'news_images/sesame-genome-v2.png',
            },
            {
                'title': '芝麻育种技术与数据整理培训',
                'content': '<p>芝麻育种技术与数据整理培训将于2026年4月15日至17日举行，面向育种人员、检测人员和数据库管理员。</p><p>培训内容包括标记辅助选择、区域试验数据整理、木酚素检测结果录入和分子指纹图谱数据准备。</p>',
                'author': '培训中心',
                'category': '活动',
                'tags': '培训,育种,数据整理',
                'views': 650,
                'is_published': True,
                'publish_time': '2026-02-20',
                'image': 'news_images/sesame-breeding-workshop.png',
            },
            {
                'title': '芝麻区域生产与品质数据完成整理',
                'content': '<p>数据库团队已完成一批芝麻区域生产与品质数据整理，覆盖西北、华中和主要种植区的代表性样品。</p><p>本批数据重点记录含油量、蛋白、脂肪酸和木酚素含量，并与温度、降水、光照、土壤等环境因子建立关联字段。</p>',
                'author': '统计团队',
                'category': '数据发布',
                'tags': '统计,生产,品质',
                'views': 1800,
                'is_published': True,
                'publish_time': '2026-02-15',
                'image': 'news_images/sesame-production-record.png',
            },
        ]
        
        for data in news_data:
            News.objects.create(**data)
        self.stdout.write(f'Created {len(news_data)} news articles')

        # Changelogs
        changelogs = [
            {
                'version': '2.0.0',
                'title': 'SesameDB v2.0 重要版本发布',
                'content': '本次版本发布芝麻参考基因组 v2.0，并补充基因注释、表达图谱、区域营养性状和批量下载能力。',
                'changes': ['发布芝麻参考基因组 v2.0', '新增 35,232 条基因注释', '整合表达图谱数据', '优化基因组浏览器性能', '增加批量下载支持'],
                'release_date': '2026-03-01',
                'is_published': True,
            },
            {
                'version': '1.5.0',
                'title': '新增功能与性能优化',
                'content': '本次更新根据用户反馈补充分析工具并优化数据库检索性能。',
                'changes': ['新增 BLAST 检索功能', '新增基因表达图谱', '增强变异浏览功能', '优化搜索性能', '开放 API 访问'],
                'release_date': '2025-11-15',
                'is_published': True,
            },
            {
                'version': '1.0.0',
                'title': '初始版本发布',
                'content': 'SesameDB 初始版本已上线，提供芝麻参考基因组、基础注释、种质资源和数据下载入口。',
                'changes': ['数据库初始发布', '参考基因组 v1.0', '基础基因注释', '基因组浏览器', '数据下载入口'],
                'release_date': '2025-06-01',
                'is_published': True,
            },
        ]
        
        for data in changelogs:
            Changelog.objects.create(**data)
        self.stdout.write(f'Created {len(changelogs)} changelog entries')

        # Announcements
        announcements = [
            {
                'title': '系统维护通知',
                'content': 'SesameDB 将于2026年3月25日进行系统维护，维护期间部分查询和下载服务可能短暂不可用。',
                'announcement_type': '维护',
                'author': '系统管理员',
                'importance': 'high',
                'is_published': True,
                'publish_date': '2026-03-18',
            },
            {
                'title': '数据提交规范更新',
                'content': '数据库团队已更新数据提交规范。提交芝麻基因组、营养品质或区域环境因子数据前，请先核对最新模板要求。',
                'announcement_type': '规范',
                'author': '数据团队',
                'importance': 'normal',
                'is_published': True,
                'publish_date': '2026-03-10',
            },
        ]
        
        for data in announcements:
            Announcement.objects.create(**data)
        self.stdout.write(f'Created {len(announcements)} announcements')

        self.stdout.write(self.style.SUCCESS('Successfully populated SesameDB with sample data!'))
