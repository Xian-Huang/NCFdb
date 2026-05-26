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
  heroImage: '/images/sunflower-field-research.webp',
  pageImages: {
    news: '/images/sunflower-field-research.webp',
    events: '/images/sunflower-field-workshop.webp',
    data: '/images/sunflower-lab-analysis.webp',
    tools: '/images/sunflower-genomics-tools.webp',
    research: '/images/sunflower-genomics-tools.webp',
    contact: '/images/sunflower-field-workshop.webp',
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

