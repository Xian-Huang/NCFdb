export const cropConfig = {
  key: 'sesame',
  dbName: 'SesameDB',
  cropName: 'Sesame',
  species: 'Sesamum indicum',
  accent: '#7c2d12',
  accentDark: '#431407',
  accentSoft: '#fff7ed',
  traitFocus: 'sesamin accumulation, capsule shattering resistance and waterlogging tolerance',
  geneCount: '41,806',
  fieldNetwork: 'Henan and Jianghan experimental networks',
  heroImage: 'https://images.unsplash.com/photo-1606914501449-5a96b6ce24ca?auto=format&fit=crop&w=1600&q=80',
  pageImages: {
    news: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1600&q=80',
    events: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=80',
    data: 'https://images.unsplash.com/photo-1603052875302-d376b7c0638a?auto=format&fit=crop&w=1600&q=80',
    tools: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1600&q=80',
    research: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=1600&q=80',
    contact: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=80',
  },
  fallbackNewsImages: [
    '/hero-bg.jpg',
    '/hero-bg.jpg',
    '/hero-bg.jpg'
  ],
  description: 'SesameDB integrates curated germplasm, nutrition traits, genome annotations, expression profiles, environmental metadata and project updates for sesame functional component research.',
  databaseIntro: 'The database links accession records, regional trial metadata, candidate genes and downloadable omics files so users can move from a phenotype question to supporting evidence without leaving the portal.',
};

export type CropConfig = typeof cropConfig;

