export const cropConfig = {
  key: 'perilla',
  dbName: 'PerillaDB',
  cropName: 'Perilla',
  species: 'Perilla frutescens',
  accent: '#6d5a7d',
  accentDark: '#3f364a',
  accentSoft: '#f6f3f8',
  traitFocus: 'aroma metabolites, seed oil and leaf color regulation',
  geneCount: '36,918',
  fieldNetwork: 'Jilin, Guizhou mountain and Korea reference populations',
  heroImage: 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1600&q=80',
  pageImages: {
    news: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1600&q=80',
    events: 'https://images.unsplash.com/photo-1556761175-129418cb2dfe?auto=format&fit=crop&w=1600&q=80',
    data: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1600&q=80',
    tools: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1600&q=80',
    research: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&w=1600&q=80',
    contact: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=80',
  },
  fallbackNewsImages: [
    '/perilla-hero.png',
    '/hero-bg.jpg',
    '/perilla-hero.png'
  ],
  description: 'PerillaDB integrates curated germplasm, nutrition traits, genome annotations, expression profiles, environmental metadata and project updates for perilla functional component research.',
  databaseIntro: 'The database links accession records, regional trial metadata, candidate genes and downloadable omics files so users can move from a phenotype question to supporting evidence without leaving the portal.',
};

export type CropConfig = typeof cropConfig;

