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
  contactProfile: {
    name: '陈益胜',
    email: 'yschen@yeah.net',
    institution: '山西农业大学',
    address: '山西省晋中市太谷县杨家庄',
  },
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
  zhName: '红花特征营养成分与指纹图谱数据库',
  zhCropName: '红花',
  zhTraitFocus: '花色苷、油酸、耐旱性与区域适应性',
  regionalFeatureSites: [
    { name: '新疆干旱绿洲试验区', code: 'XJ', province: '新疆', region: '西北', lat: 43.82, lng: 87.62, varieties: ['新红花5号', '裕民无刺'], trait: '高油酸与耐旱', component: '油酸 76.4%，羟基红花黄色素A 1.6%', temperature: '6-9 ℃', precipitation: '150-300 mm', sunshine: '2800-3200 h', soil: '灰漠土 / 灌淤土', note: '强光和干旱条件适合评价高油酸、耐旱材料。' },
    { name: '云南高原花色评价区', code: 'YN', province: '云南', region: '西南', lat: 25.04, lng: 102.71, varieties: ['云红花3号', '滇红花地方种'], trait: '花色素与药用成分', component: '羟基红花黄色素A 2.1%，总黄酮 18.5 mg/g', temperature: '14-17 ℃', precipitation: '850-1050 mm', sunshine: '2100-2400 h', soil: '红壤', note: '高原温差和光照条件适合观察花色和功能成分积累。' },
    { name: '甘肃河西耐旱评价点', code: 'GS', province: '甘肃', region: '西北', lat: 38.93, lng: 100.45, varieties: ['甘红1号', '河西红花'], trait: '旱作稳产与早熟', component: '油分 31.8%，亚油酸 68.2%', temperature: '7-10 ℃', precipitation: '120-250 mm', sunshine: '2850-3150 h', soil: '灌漠土 / 砂壤土', note: '典型干旱环境，用于筛选早熟和稳产品种。' },
  ],
  fingerprintMarkers: [
    { marker: 'CtSSR-05', chromosome: 'Chr05', type: 'SSR', status: '待导入', usage: '红花品种身份识别' },
    { marker: 'CtSNP-08', chromosome: 'Chr08', type: 'SNP', status: '预留', usage: '高油酸材料分组' },
    { marker: 'CtInDel-13', chromosome: 'Chr13', type: 'InDel', status: '预留', usage: '核心种质校验' },
  ],
};

export type CropConfig = typeof cropConfig;

