export const cropConfig = {
  key: 'sunflower',
  dbName: 'SunflowerDB',
  cropName: 'Sunflower',
  species: 'Helianthus annuus',
  accent: '#16a34a',
  accentDark: '#14532d',
  accentSoft: '#f0fdf4',
  traitFocus: 'oil quality, salt tolerance and broomrape resistance',
  geneCount: '52,232',
  fieldNetwork: 'Inner Mongolia and Xinjiang field stations',
  heroImage: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=1600&q=80',
  pageImages: {
    news: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80',
    events: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80',
    data: 'https://images.unsplash.com/photo-1581093458791-9d42cc0302c1?auto=format&fit=crop&w=1600&q=80',
    tools: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1600&q=80',
    research: 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&w=1600&q=80',
    contact: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80',
  },
  fallbackNewsImages: [
    '/hero-bg.jpg',
    '/hero-bg.jpg',
    '/hero-bg.jpg'
  ],
  description: 'SunflowerDB integrates curated germplasm, nutrition traits, genome annotations, expression profiles, environmental metadata and project updates for sunflower functional component research.',
  databaseIntro: 'The database links accession records, regional trial metadata, candidate genes and downloadable omics files so users can move from a phenotype question to supporting evidence without leaving the portal.',
};

export type CropConfig = typeof cropConfig;

