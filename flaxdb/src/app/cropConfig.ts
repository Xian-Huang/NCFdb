export const cropConfig = {
  key: 'flax',
  dbName: 'FlaxDB',
  cropName: 'Flax',
  species: 'Linum usitatissimum',
  accent: '#2563eb',
  accentDark: '#1e3a8a',
  accentSoft: '#eff6ff',
  traitFocus: 'ALA content, fiber quality and drought adaptation',
  geneCount: '31,522',
  fieldNetwork: 'Heilongjiang, Inner Mongolia and Canadian prairie panels',
  heroImage: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1600&q=80',
  pageImages: {
    news: 'https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=1600&q=80',
    events: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=80',
    data: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=1600&q=80',
    tools: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1600&q=80',
    research: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1600&q=80',
    contact: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=80',
  },
  fallbackNewsImages: [
    '/hero-bg.jpg',
    '/hero-bg.jpg',
    '/hero-bg.jpg'
  ],
  description: 'FlaxDB integrates curated germplasm, nutrition traits, genome annotations, expression profiles, environmental metadata and project updates for flax functional component research.',
  databaseIntro: 'The database links accession records, regional trial metadata, candidate genes and downloadable omics files so users can move from a phenotype question to supporting evidence without leaving the portal.',
};

export type CropConfig = typeof cropConfig;

