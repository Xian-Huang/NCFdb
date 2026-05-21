export const cropConfig = {
  key: 'safflower',
  dbName: 'SafflowerDB',
  cropName: 'Safflower',
  species: 'Carthamus tinctorius',
  accent: '#dc2626',
  accentDark: '#7f1d1d',
  accentSoft: '#fef2f2',
  traitFocus: 'floral pigment, drought tolerance and oleic acid improvement',
  geneCount: '28,740',
  fieldNetwork: 'Xinjiang, Yunnan plateau and dry-hot reference sites',
  heroImage: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=1600&q=80',
  pageImages: {
    news: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1600&q=80',
    events: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1600&q=80',
    data: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1600&q=80',
    tools: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=1600&q=80',
    research: 'https://images.unsplash.com/photo-1581093196277-9f6d7fbd1f1b?auto=format&fit=crop&w=1600&q=80',
    contact: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80',
  },
  fallbackNewsImages: [
    '/safflower-hero.png',
    '/hero-bg.jpg',
    '/safflower-hero.png'
  ],
  description: 'SafflowerDB integrates curated germplasm, nutrition traits, genome annotations, expression profiles, environmental metadata and project updates for safflower functional component research.',
  databaseIntro: 'The database links accession records, regional trial metadata, candidate genes and downloadable omics files so users can move from a phenotype question to supporting evidence without leaving the portal.',
};

export type CropConfig = typeof cropConfig;

