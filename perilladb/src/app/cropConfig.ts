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
  contactProfile: {
    name: '李环',
    email: 'lihuan2729@163.com',
    institution: '中国农业科学院油料作物研究所',
    address: '湖北省武汉市武昌区徐东二路2号',
  },
  heroImage: '/perilla-hero.png',
  pageImages: {
    news: '/api/media/news_images/perilla-cold-climate-variety.png',
    events: '/api/media/news_images/perilla-symposium-2026.png',
    data: '/api/media/news_images/perilla-metabolite-lab.png',
    tools: '/api/media/news_images/perilla-genome-release.png',
    research: '/api/media/news_images/perilla-genome-release.png',
    contact: '/api/media/news_images/perilla-symposium-2026.png',
  },
  fallbackNewsImages: [
    '/perilla-hero.png',
    '/api/media/news_images/perilla-metabolite-lab.png',
    '/api/media/news_images/perilla-symposium-2026.png'
  ],
  description: 'PerillaDB integrates curated germplasm, nutrition traits, genome annotations, expression profiles, environmental metadata and project updates for perilla functional component research.',
  databaseIntro: 'The database links accession records, regional trial metadata, candidate genes and downloadable omics files so users can move from a phenotype question to supporting evidence without leaving the portal.',
  zhName: '紫苏特征营养成分与指纹图谱数据库',
  zhCropName: '紫苏',
  zhTraitFocus: '芳香代谢物、籽粒油分、叶色与区域适应性',
  regionalFeatureSites: [
    { name: '吉林冷凉区紫苏资源圃', code: 'JL', province: '吉林', region: '东北', lat: 43.9, lng: 125.32, varieties: ['吉苏1号', '白苏地方种'], trait: '高油分与冷凉适应', component: 'α-亚麻酸 58.6%，总油分 43.2%', temperature: '4-7 ℃', precipitation: '550-750 mm', sunshine: '2300-2600 h', soil: '黑土', note: '冷凉昼夜温差有利于籽粒油分和脂肪酸品质评价。' },
    { name: '贵州山地芳香型评价区', code: 'GZ', province: '贵州', region: '西南', lat: 26.65, lng: 106.63, varieties: ['黔苏2号', '紫叶香苏'], trait: '芳香代谢物与叶用性状', component: '紫苏醛 1.8%，迷迭香酸 4.5 mg/g', temperature: '14-17 ℃', precipitation: '1050-1250 mm', sunshine: '1200-1600 h', soil: '黄壤', note: '湿润山地环境适合比较芳香成分与叶色变化。' },
    { name: '韩国参考群体试验点', code: 'KR', province: 'Korea', region: '东亚', lat: 36.35, lng: 127.38, varieties: ['K-Perilla-A', 'K-Perilla-B'], trait: '种质多样性对照', component: 'α-亚麻酸 56.9%，挥发油 0.72%', temperature: '11-14 ℃', precipitation: '900-1200 mm', sunshine: '2000-2300 h', soil: '壤土', note: '预留国际参考群体，用于后续分子指纹和品质比较。' },
  ],
  fingerprintMarkers: [
    { marker: 'PfSSR-02', chromosome: 'Chr02', type: 'SSR', status: '待导入', usage: '紫苏种质身份识别' },
    { marker: 'PfSNP-09', chromosome: 'Chr09', type: 'SNP', status: '预留', usage: '芳香型材料分组' },
    { marker: 'PfKASP-14', chromosome: 'Chr14', type: 'KASP', status: '预留', usage: '功能位点验证' },
  ],
};

export type CropConfig = typeof cropConfig;

