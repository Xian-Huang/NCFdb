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
  zhName: '芝麻特征营养成分与指纹图谱数据库',
  zhCropName: '芝麻',
  zhTraitFocus: '木酚素积累、含油量、抗逆性与区域适应性',
  regionalFeatureSites: [
    { name: '甘肃陇东旱作试验区', code: 'GS', province: '甘肃', region: '西北', lat: 35.73, lng: 107.64, varieties: ['陇芝1号', '陇芝3号'], trait: '高木酚素与耐旱性', component: '芝麻素 4.8 mg/g，芝麻林素 2.1 mg/g', temperature: '9-12 ℃', precipitation: '350-520 mm', sunshine: '2450-2850 h', soil: '黄绵土 / 砂壤土', note: '昼夜温差大、光照充足，适合筛选高木酚素和抗旱材料。' },
    { name: '湖北江汉平原试验区', code: 'HB', province: '湖北', region: '华中', lat: 30.67, lng: 112.24, varieties: ['中芝13', '鄂芝6号'], trait: '高油分与稳产', component: '芝麻素 3.9 mg/g，芝麻林素 1.7 mg/g', temperature: '15-17 ℃', precipitation: '1050-1250 mm', sunshine: '1800-2100 h', soil: '潮土 / 水稻土', note: '温暖湿润，适合比较水分条件对油分和木酚素积累的影响。' },
    { name: '河南豫南综合评价区', code: 'HN', province: '河南', region: '华中', lat: 32.13, lng: 114.07, varieties: ['豫芝11', '郑芝98N09'], trait: '抗病性与品质平衡', component: '芝麻素 4.2 mg/g，芝麻林素 1.9 mg/g', temperature: '14-16 ℃', precipitation: '800-1050 mm', sunshine: '1900-2300 h', soil: '黄褐土 / 砂姜黑土', note: '降水与热量条件适中，适合开展区域适应性和品质稳定性评价。' },
  ],
  fingerprintMarkers: [
    { marker: 'SiSSR-01', chromosome: 'Chr01', type: 'SSR', status: '待导入', usage: '品种身份识别' },
    { marker: 'SiSNP-07', chromosome: 'Chr07', type: 'SNP', status: '待导入', usage: '高木酚素材料分组' },
    { marker: 'SiInDel-11', chromosome: 'Chr11', type: 'InDel', status: '预留', usage: '核心种质一致性校验' },
  ],
};

export type CropConfig = typeof cropConfig;

