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
                'title': 'New High-ALA Flax Variety Released',
                'content': '<p>The Heilongjiang Academy of Agricultural Sciences has successfully developed a new flax variety with alpha-linolenic acid (ALA) content exceeding 60%.</p><p>This breakthrough variety was developed through marker-assisted selection and field trials across multiple locations.</p>',
                'author': 'Dr. Li Wei',
                'category': 'research',
                'tags': 'breeding,ALA,new variety',
                'views': 980,
                'is_published': True,
                'publish_time': '2026-03-15',
                'image': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800',
            },
            {
                'title': 'International Flax Research Conference 2026',
                'content': '<p>The annual International Flax and Bast Fiber Conference will be held in Saskatoon, Canada from August 15-18, 2026.</p><p>Researchers from over 25 countries will gather to discuss the latest advances in flax genomics and breeding.</p>',
                'author': 'CSPG',
                'category': 'events',
                'tags': 'conference,international,flax',
                'views': 720,
                'is_published': True,
                'publish_time': '2026-03-10',
                'image': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
            },
            {
                'title': 'Flax Genome Sequence Now Available',
                'content': '<p>We are pleased to announce the release of the flax reference genome. This assembly features high contiguity and completeness.</p>',
                'author': 'Genome Team',
                'category': 'research',
                'tags': 'genome,annotation,release',
                'views': 1650,
                'is_published': True,
                'publish_time': '2026-02-28',
                'image': 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800',
            },
        ]
        
        for data in news_data:
            News.objects.create(**data)
        self.stdout.write(f'Created {len(news_data)} news articles')

        changelogs = [
            {
                'version': '1.0.0',
                'title': 'Initial Release: FlaxDB v1.0',
                'content': 'Welcome to FlaxDB! Our initial release provides access to the flax reference genome and basic annotation data.',
                'changes': ['Initial database release', 'Reference genome v1.0', 'Basic gene annotations', 'Genome browser', 'Data download portal'],
                'release_date': '2026-03-01',
                'is_published': True,
            },
        ]
        
        for data in changelogs:
            Changelog.objects.create(**data)
        self.stdout.write(f'Created {len(changelogs)} changelog entries')

        announcements = [
            {
                'title': 'Welcome to FlaxDB',
                'content': 'We are excited to launch FlaxDB - the comprehensive database for flax genomic data and breeding resources.',
                'announcement_type': 'News',
                'author': 'System Admin',
                'importance': 'high',
                'is_published': True,
                'publish_date': '2026-03-20',
            },
        ]
        
        for data in announcements:
            Announcement.objects.create(**data)
        self.stdout.write(f'Created {len(announcements)} announcements')

        self.stdout.write(self.style.SUCCESS('Successfully populated FlaxDB with sample data!'))
