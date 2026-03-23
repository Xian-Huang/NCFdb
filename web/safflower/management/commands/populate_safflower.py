from django.core.management.base import BaseCommand
from safflower.models import (
    DownloadFile, Region, Variety, Gene, GeneExpression,
    EnvironmentalFactor, Institution, Announcement, News, Changelog
)

class Command(BaseCommand):
    help = 'Populate safflower database with sample data'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample data for SafflowerDB...')
        
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
                'file_name': 'Safflower Reference Genome v1.0',
                'file_type': 'FASTA',
                'file_size': '1.3 GB',
                'description': 'High-quality reference genome assembly for safflower (Carthamus tinctorius L.)',
                'download_url': '#',
                'category': 'Genome',
                'version': 'v1.0',
                'is_published': True,
            },
            {
                'file_name': 'Safflower Genome Annotation v1.0',
                'file_type': 'GFF3',
                'file_size': '32 MB',
                'description': 'Comprehensive gene annotation for safflower reference genome',
                'download_url': '#',
                'category': 'Annotation',
                'version': 'v1.0',
                'is_published': True,
            },
            {
                'file_name': 'Safflower Transcriptome Data',
                'file_type': 'FASTQ',
                'file_size': '780 MB',
                'description': 'RNA-seq data from various safflower tissues and developmental stages',
                'download_url': '#',
                'category': 'Transcriptome',
                'version': 'v1.0',
                'is_published': True,
            },
            {
                'file_name': 'Safflower Safflower Yellow Pigment Data',
                'file_type': 'CSV',
                'file_size': '12 MB',
                'description': 'Comprehensive pigment (carthamin) composition data',
                'download_url': '#',
                'category': 'Phenotype',
                'version': 'v1.0',
                'is_published': True,
            },
            {
                'file_name': 'Safflower Oil Quality Dataset',
                'file_type': 'CSV',
                'file_size': '18 MB',
                'description': 'High-linoleic and high-oleic safflower oil composition data',
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
            {'name': 'Gansu Province', 'code': 'GS', 'country': 'China', 'climate': 'Temperate', 'description': 'Major safflower producing province in China'},
            {'name': 'Yunnan Province', 'code': 'YN', 'country': 'China', 'climate': 'Subtropical', 'description': 'Leading safflower cultivation area'},
            {'name': 'Xinjiang Province', 'code': 'XJ', 'country': 'China', 'climate': 'Arid', 'description': 'Important safflower production region'},
            {'name': 'India', 'code': 'IND', 'country': 'India', 'climate': 'Tropical', 'description': 'World largest safflower producer'},
            {'name': 'Mexico', 'code': 'MEX', 'country': 'Mexico', 'climate': 'Arid', 'description': 'Major safflower exporter'},
            {'name': 'United States', 'code': 'USA', 'country': 'USA', 'climate': 'Temperate', 'description': 'Leading safflower producer in Americas'},
            {'name': 'Australia', 'code': 'AUS', 'country': 'Australia', 'climate': 'Arid', 'description': 'Major safflower exporter'},
            {'name': 'Spain', 'code': 'ESP', 'country': 'Spain', 'climate': 'Mediterranean', 'description': 'European safflower producer'},
        ]
        
        region_objs = []
        for data in regions:
            obj = Region.objects.create(**data)
            region_objs.append(obj)
        self.stdout.write(f'Created {len(regions)} regions')

        varieties = [
            {'name': 'Honghua 1', 'variety_code': 'HH1', 'region': region_objs[0], 'seed_color': 'White', 'oil_content': 38.5, 'maturity_days': 130, 'yield_per_hectare': 2500, 'height': 120, 'description': 'High oil content variety from Gansu'},
            {'name': 'Yunhong 2', 'variety_code': 'YH2', 'region': region_objs[1], 'seed_color': 'White', 'oil_content': 40.2, 'maturity_days': 145, 'yield_per_hectare': 2200, 'height': 130, 'description': 'High pigment variety from Yunnan'},
            {'name': 'Xinjiang Safflower', 'variety_code': 'XJSH', 'region': region_objs[2], 'seed_color': 'White', 'oil_content': 39.8, 'maturity_days': 120, 'yield_per_hectare': 2800, 'height': 110, 'description': 'Drought tolerant variety'},
            {'name': 'N-400', 'variety_code': 'N400', 'region': region_objs[3], 'seed_color': 'White', 'oil_content': 37.5, 'maturity_days': 110, 'yield_per_hectare': 1500, 'height': 100, 'description': 'Indian improved variety'},
            {'name': 'Saffire', 'variety_code': 'SFIR', 'region': region_objs[4], 'seed_color': 'White', 'oil_content': 41.0, 'maturity_days': 125, 'yield_per_hectare': 2000, 'height': 115, 'description': 'Mexican high-oil variety'},
            {'name': 'Columbian', 'variety_code': 'COL', 'region': region_objs[5], 'seed_color': 'White', 'oil_content': 40.5, 'maturity_days': 130, 'yield_per_hectare': 2100, 'height': 118, 'description': 'US commercial variety'},
        ]
        
        for data in varieties:
            Variety.objects.create(**data)
        self.stdout.write(f'Created {len(varieties)} varieties')

        genes = [
            {'gene_id': 'CTR1001', 'name': 'Safflower Oleosin', 'symbol': 'OLE', 'chromosome': '1', 'start_position': 1234567, 'end_position': 1245678, 'strand': '+', 'gene_type': 'CDS', 'function': 'Oil body formation', 'pathway': 'Lipid biosynthesis', 'description': 'Encodes oleosin protein involved in oil body formation'},
            {'gene_id': 'CTR1002', 'name': 'Safflower Fatty Acid Desaturase', 'symbol': 'FAD', 'chromosome': '2', 'start_position': 2345678, 'end_position': 2356789, 'strand': '+', 'gene_type': 'CDS', 'function': 'Linoleic acid synthesis', 'pathway': 'Lipid biosynthesis', 'description': 'Key enzyme in linoleic acid synthesis'},
            {'gene_id': 'CTR1003', 'name': 'Safflower Carthamin Synthase', 'symbol': 'CHS', 'chromosome': '3', 'start_position': 3456789, 'end_position': 3467890, 'strand': '-', 'gene_type': 'CDS', 'function': 'Pigment biosynthesis', 'pathway': 'Secondary metabolism', 'description': 'Key enzyme in safflower yellow pigment synthesis'},
            {'gene_id': 'CTR1004', 'name': 'Safflower Drought Response', 'symbol': 'DRG', 'chromosome': '4', 'start_position': 4567890, 'end_position': 4578901, 'strand': '+', 'gene_type': 'CDS', 'function': 'Drought tolerance', 'pathway': 'Stress response', 'description': 'Involved in drought stress response'},
            {'gene_id': 'CTR1005', 'name': 'Safflower Flowering Locus T', 'symbol': 'FT', 'chromosome': '5', 'start_position': 5678901, 'end_position': 5689012, 'strand': '+', 'gene_type': 'CDS', 'function': 'Flowering regulation', 'pathway': 'Developmental regulation', 'description': 'Flowering time gene'},
            {'gene_id': 'CTR1006', 'name': 'Safflower Oil Content QTL', 'symbol': 'OCQ', 'chromosome': '6', 'start_position': 6789012, 'end_position': 6799123, 'strand': '-', 'gene_type': 'QTL', 'function': 'Oil content regulation', 'pathway': 'Lipid biosynthesis', 'description': 'Major QTL for oil content'},
        ]
        
        for data in genes:
            Gene.objects.create(**data)
        self.stdout.write(f'Created {len(genes)} genes')

        institutions = [
            {'name': 'Gansu Academy of Agricultural Sciences', 'abbreviation': 'GAAS', 'country': 'China', 'city': 'Lanzhou', 'address': 'No. 1 Anning East Road', 'website': 'www.gaas.cn', 'email': 'info@gaas.cn', 'phone': '+86-931-7612610', 'contact_person': 'Dr. Zhang Wei', 'description': 'Leading safflower research institution in China', 'institution_type': 'Research'},
            {'name': 'Yunnan Academy of Agricultural Sciences', 'abbreviation': 'YAAS', 'country': 'China', 'city': 'Kunming', 'address': 'No. 1988 Beijing Road', 'website': 'www.yaas.cn', 'email': 'yaas@yaas.cn', 'phone': '+86-871-65883320', 'contact_person': 'Dr. Li Hua', 'description': 'Safflower research in Yunnan', 'institution_type': 'Research'},
            {'name': 'Indian Institute of Safflower Research', 'abbreviation': 'IISR', 'country': 'India', 'city': 'Solapur', 'address': 'Pune Road', 'website': 'www.iisr.nic.in', 'email': 'director@iisr.nic.in', 'phone': '+91-217-2372001', 'contact_person': 'Dr. Patil M', 'description': 'Premier safflower research institute in India', 'institution_type': 'Research'},
        ]
        
        for data in institutions:
            Institution.objects.create(**data)
        self.stdout.write(f'Created {len(institutions)} institutions')

        news_data = [
            {
                'title': 'New High-Oil Safflower Variety Released',
                'content': '<p>The Gansu Academy of Agricultural Sciences has developed a new safflower variety with oil content exceeding 42%.</p><p>This variety shows excellent adaptability to arid conditions.</p>',
                'author': 'Dr. Zhang Wei',
                'category': 'research',
                'tags': 'breeding,oil content,new variety',
                'views': 850,
                'is_published': True,
                'publish_time': '2026-03-15',
                'image': 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800',
            },
            {
                'title': 'International Safflower Congress 2026',
                'content': '<p>The International Safflower Congress will be held in Lanzhou, China from September 10-14, 2026.</p>',
                'author': 'GAAS',
                'category': 'events',
                'tags': 'conference,international,safflower',
                'views': 620,
                'is_published': True,
                'publish_time': '2026-03-10',
                'image': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
            },
            {
                'title': 'Safflower Genome Sequence Now Available',
                'content': '<p>We are pleased to announce the release of the safflower reference genome.</p>',
                'author': 'Genome Team',
                'category': 'research',
                'tags': 'genome,annotation,release',
                'views': 1420,
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
                'title': 'Initial Release: SafflowerDB v1.0',
                'content': 'Welcome to SafflowerDB! Our initial release provides access to the safflower reference genome and basic annotation data.',
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
                'title': 'Welcome to SafflowerDB',
                'content': 'We are excited to launch SafflowerDB - the comprehensive database for safflower genomic data and breeding resources.',
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

        self.stdout.write(self.style.SUCCESS('Successfully populated SafflowerDB with sample data!'))
