export const cropConfig = {
  key: 'sunflower',
  dbName: 'SunflowerDB',
  cropName: 'Sunflower',
  species: 'Helianthus annuus',
  accent: '#d97706',
  accentDark: '#78350f',
  accentSoft: '#fffbeb',
  traitFocus: 'oil quality, salt tolerance and broomrape resistance',
  geneCount: '52,232',
  fieldNetwork: 'Inner Mongolia and Xinjiang field stations',
  contactProfile: {
    name: '禹晓',
    email: 'yuxiao@zzuli.edu.cn',
    institution: '郑州轻工业大学',
    address: '河南省郑州市高新技术开发区科学大道136号',
  },
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
  zhName: '向日葵特征营养成分与指纹图谱数据库',
  zhCropName: '向日葵',
  zhTraitFocus: '油分品质、耐盐碱、列当抗性与区域适应性',
  regionalFeatureSites: [
    { name: '内蒙古河套盐碱评价区', code: 'IM', province: '内蒙古', region: '华北', lat: 40.82, lng: 111.76, varieties: ['蒙葵4号', 'RH118'], trait: '耐盐碱与高油分', component: '油分 49.2%，油酸 82.1%', temperature: '5-8 ℃', precipitation: '250-400 mm', sunshine: '2800-3100 h', soil: '盐化灌淤土', note: '盐碱和强光条件适合评价耐盐碱材料与油分品质。' },
    { name: '新疆灌溉绿洲试验区', code: 'XJ', province: '新疆', region: '西北', lat: 43.82, lng: 87.62, varieties: ['新葵杂6号', 'KWS303'], trait: '高产与抗逆', component: '油分 47.8%，亚油酸 61.3%', temperature: '6-10 ℃', precipitation: '150-300 mm', sunshine: '2850-3300 h', soil: '灰漠土 / 灌淤土', note: '高光照与灌溉条件便于分析产量、油分和抗逆指标。' },
    { name: '黑龙江冷凉熟期评价点', code: 'HLJ', province: '黑龙江', region: '东北', lat: 45.76, lng: 126.64, varieties: ['龙葵杂4号', '早熟油葵'], trait: '早熟与稳产', component: '油分 44.8%，蛋白 17.6%', temperature: '2-5 ℃', precipitation: '500-650 mm', sunshine: '2300-2600 h', soil: '黑土', note: '冷凉区用于早熟品种和稳定油分表现评价。' },
    { name: '吉林抗病鉴定圃', code: 'JL', province: '吉林', region: '东北', lat: 43.90, lng: 125.32, varieties: ['吉葵2号', 'LD5009'], trait: '菌核病抗性与稳产', component: '油分 45.2%，油酸 71.4%', temperature: '4-7 ℃', precipitation: '550-720 mm', sunshine: '2400-2700 h', soil: '黑钙土 / 草甸土', note: '适合比较冷凉湿润环境下抗病性与籽粒品质稳定性。' },
    { name: '甘肃旱地评价点', code: 'GS', province: '甘肃', region: '西北', lat: 36.06, lng: 103.83, varieties: ['陇葵杂3号', 'S606'], trait: '抗旱与籽粒充实', component: '油分 46.1%，亚油酸 58.7%', temperature: '7-10 ℃', precipitation: '300-450 mm', sunshine: '2500-2900 h', soil: '黄绵土 / 灰钙土', note: '旱作条件用于筛选籽粒充实度高、稳产性好的材料。' },
    { name: '宁夏盐碱筛选点', code: 'NX', province: '宁夏', region: '西北', lat: 38.49, lng: 106.23, varieties: ['宁葵1号', 'SH363'], trait: '耐盐碱与出苗活力', component: '油分 45.7%，蛋白 18.1%', temperature: '6-9 ℃', precipitation: '180-300 mm', sunshine: '2800-3100 h', soil: '盐化灌淤土 / 沙壤土', note: '盐分胁迫明显，适合开展苗期耐盐碱和成熟期品质联合评价。' },
    { name: '河北适应性鉴定圃', code: 'HB', province: '河北', region: '华北', lat: 38.04, lng: 114.52, varieties: ['冀葵杂2号', 'NK212'], trait: '广适性与抗倒伏', component: '油分 44.4%，油酸 76.8%', temperature: '10-13 ℃', precipitation: '450-650 mm', sunshine: '2400-2800 h', soil: '褐土 / 潮土', note: '代表华北平原灌溉区，用于验证株型、抗倒伏与品质表现。' },
    { name: '山东品质验证点', code: 'SD', province: '山东', region: '华东', lat: 36.65, lng: 117.12, varieties: ['山葵杂5号', 'DK3790'], trait: '油酸积累与商品性', component: '油分 43.8%，油酸 79.6%', temperature: '11-14 ℃', precipitation: '600-780 mm', sunshine: '2300-2600 h', soil: '棕壤 / 潮土', note: '用于验证较高降水条件下油酸积累和籽粒商品性。' },
  ],
  fingerprintMarkers: [
    { marker: 'HaSSR-04', chromosome: 'Chr04', type: 'SSR', status: '待导入', usage: '向日葵品种身份识别' },
    { marker: 'HaSNP-10', chromosome: 'Chr10', type: 'SNP', status: '预留', usage: '高油酸材料分组' },
    { marker: 'HaKASP-16', chromosome: 'Chr16', type: 'KASP', status: '预留', usage: '耐盐碱位点验证' },
  ],
};

export type CropConfig = typeof cropConfig;

