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
                'title': 'New High-Oil Content Sesame Variety Released',
                'content': '<p>The National Sesame Improvement Center has successfully developed a new sesame variety with oil content exceeding 58%. This breakthrough variety was developed through marker-assisted selection and field trials across multiple locations.</p><p>The new variety "Zhongzhi 2" shows excellent adaptability and can yield up to 2800 kg per hectare under optimal conditions.</p>',
                'author': 'Dr. Zhang Hong',
                'category': 'research',
                'tags': 'breeding,oil content,new variety',
                'views': 1250,
                'is_published': True,
                'publish_time': '2026-03-15',
                'image': 'https://images.unsplash.com/photo-1595854341625-f71831d39e71?w=800',
            },
            {
                'title': 'International Sesame Genomics Consortium Meeting 2026',
                'content': '<p>The annual International Sesame Genomics Consortium Meeting will be held in Beijing, China from July 20-23, 2026. Researchers from over 20 countries will gather to discuss the latest advances in sesame genomics and breeding.</p><p>Key topics include the release of the new sesame reference genome v2.0 and collaborative efforts on functional genomics.</p>',
                'author': 'CAAS Publicity',
                'category': 'events',
                'tags': 'conference,international,genomics',
                'views': 890,
                'is_published': True,
                'publish_time': '2026-03-10',
                'image': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
            },
            {
                'title': 'Sesame Genome Sequence v2.0 Now Available',
                'content': '<p>We are pleased to announce the release of the sesame reference genome version 2.0. This updated assembly features significant improvements in contiguity and completeness, with 98.5% of the genome now captured in chromosome-level scaffolds.</p><p>The new genome annotation includes 35,232 high-confidence gene models, representing a 15% increase from the previous version.</p>',
                'author': 'Genome Team',
                'category': 'research',
                'tags': 'genome,annotation,release',
                'views': 2100,
                'is_published': True,
                'publish_time': '2026-02-28',
                'image': 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800',
            },
            {
                'title': 'Workshop on Sesame Breeding Technologies',
                'content': '<p>A hands-on workshop on modern sesame breeding technologies will be held at the Institute of Crop Sciences, CAAS from April 15-17, 2026.</p><p>The workshop will cover topics including marker-assisted selection, genomic selection, and doubled haploid technology applications in sesame breeding.</p>',
                'author': 'Training Center',
                'category': 'events',
                'tags': 'workshop,breeding,training',
                'views': 650,
                'is_published': True,
                'publish_time': '2026-02-20',
                'image': 'https://images.unsplash.com/photo-1531973819741-e27a5ce2bf5f?w=800',
            },
            {
                'title': 'Global Sesame Production Reaches Record High',
                'content': '<p>According to the latest FAO statistics, global sesame production has reached a record 7.2 million tons in 2025, representing a 8% increase from the previous year.</p><p>China remains the worlds largest producer, followed by Myanmar, India, and Sudan. The increasing demand for sesame oil and sesame-based products continues to drive production growth.</p>',
                'author': 'Statistics Team',
                'category': 'publications',
                'tags': 'statistics,production,global',
                'views': 1800,
                'is_published': True,
                'publish_time': '2026-02-15',
                'image': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
            },
        ]
        
        for data in news_data:
            News.objects.create(**data)
        self.stdout.write(f'Created {len(news_data)} news articles')

        # Changelogs
        changelogs = [
            {
                'version': '2.0.0',
                'title': 'Major Release: SesameDB v2.0',
                'content': 'This major release includes the new reference genome v2.0 with significantly improved assembly quality and comprehensive gene annotations.',
                'changes': ['Released sesame reference genome v2.0', 'Added 35,232 gene annotations', 'Integrated new expression atlas data', 'Improved genome browser performance', 'Added bulk data download support'],
                'release_date': '2026-03-01',
                'is_published': True,
            },
            {
                'version': '1.5.0',
                'title': 'New Features and Improvements',
                'content': 'This release adds new analysis tools and improves database performance based on user feedback.',
                'changes': ['Added BLAST search functionality', 'New gene expression atlas', 'Enhanced variant browser', 'Improved search performance', 'Added API access'],
                'release_date': '2025-11-15',
                'is_published': True,
            },
            {
                'version': '1.0.0',
                'title': 'Initial Release',
                'content': 'Welcome to SesameDB! Our initial release provides access to the sesame reference genome and basic annotation data.',
                'changes': ['Initial database release', 'Reference genome v1.0', 'Basic gene annotations', 'Genome browser', 'Data download portal'],
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
                'title': 'Scheduled Maintenance Notice',
                'content': 'SesameDB will undergo scheduled maintenance on March 25, 2026 from 2:00 AM to 6:00 AM UTC. Some services may be temporarily unavailable.',
                'announcement_type': 'Maintenance',
                'author': 'System Admin',
                'importance': 'high',
                'is_published': True,
                'publish_date': '2026-03-18',
            },
            {
                'title': 'New Data Submission Guidelines',
                'content': 'We have updated our data submission guidelines. Please review the new requirements before submitting your sesame genomic data.',
                'announcement_type': 'Policy',
                'author': 'Data Team',
                'importance': 'normal',
                'is_published': True,
                'publish_date': '2026-03-10',
            },
        ]
        
        for data in announcements:
            Announcement.objects.create(**data)
        self.stdout.write(f'Created {len(announcements)} announcements')

        self.stdout.write(self.style.SUCCESS('Successfully populated SesameDB with sample data!'))
