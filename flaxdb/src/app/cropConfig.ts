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
  zhName: '亚麻特征营养成分与指纹图谱数据库',
  zhCropName: '亚麻',
  zhTraitFocus: 'α-亚麻酸、纤维品质、抗旱性与区域适应性',
  regionalFeatureSites: [
    { name: '黑龙江冷凉区试验点', code: 'HLJ', province: '黑龙江', region: '东北', lat: 45.76, lng: 126.64, varieties: ['黑亚18', '垦亚10号'], trait: '高α-亚麻酸与早熟', component: 'ALA 54.2%，油分 39.6%', temperature: '2-5 ℃', precipitation: '500-650 mm', sunshine: '2300-2600 h', soil: '黑土', note: '冷凉环境利于筛选早熟和高不饱和脂肪酸材料。' },
    { name: '内蒙古旱作评价区', code: 'IM', province: '内蒙古', region: '华北', lat: 40.82, lng: 111.76, varieties: ['坝亚9号', '内亚7号'], trait: '耐旱与稳产', component: 'ALA 51.8%，蛋白 21.4%', temperature: '5-8 ℃', precipitation: '300-450 mm', sunshine: '2700-3100 h', soil: '栗钙土 / 砂壤土', note: '干旱和强光条件适合评价耐旱性与籽粒品质稳定性。' },
    { name: '加拿大草原参考区', code: 'CA', province: 'Prairie', region: '北美', lat: 50.45, lng: -104.62, varieties: ['CDC Bethune', 'Prairie Grande'], trait: '油用品质与抗倒伏', component: 'ALA 53.1%，木酚素 8.6 mg/g', temperature: '1-4 ℃', precipitation: '350-500 mm', sunshine: '2200-2500 h', soil: '黑钙土', note: '作为国际对照区预留，用于后续跨区域品质比较。' },
  ],
  fingerprintMarkers: [
    { marker: 'LuSSR-03', chromosome: 'Chr03', type: 'SSR', status: '待导入', usage: '亚麻品种身份识别' },
    { marker: 'LuSNP-12', chromosome: 'Chr12', type: 'SNP', status: '预留', usage: '高ALA材料分组' },
    { marker: 'LuInDel-15', chromosome: 'Chr15', type: 'InDel', status: '预留', usage: '核心种质校验' },
  ],
};

export type CropConfig = typeof cropConfig;

