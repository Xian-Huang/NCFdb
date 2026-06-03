import os
from django.db import models

# 下载文件表
class DownloadFile(models.Model):
    file_name = models.CharField(max_length=200, verbose_name="文件名称")
    file_type = models.CharField(max_length=50, verbose_name="文件类型")
    file_size = models.CharField(max_length=50, verbose_name="文件大小")
    description = models.TextField(null=True, blank=True, verbose_name="文件描述")
    download_url = models.URLField(verbose_name="下载地址")
    category = models.CharField(max_length=50, verbose_name="分类")
    version = models.CharField(max_length=50, null=True, blank=True, verbose_name="版本")
    is_published = models.BooleanField(default=True, verbose_name="是否发布")
    create_time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    update_time = models.DateTimeField(auto_now=True, verbose_name="更新时间")

    class Meta:
        db_table = "flaxdb_download_files"
        verbose_name = "下载文件"
        verbose_name_plural = "下载文件"
        ordering = ['-create_time']

    def __str__(self):
        return self.file_name


# 区域信息表
class Region(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name="区域名称")
    code = models.CharField(max_length=50, unique=True, verbose_name="区域代码")
    country = models.CharField(max_length=100, verbose_name="国家")
    climate = models.CharField(max_length=100, null=True, blank=True, verbose_name="气候类型")
    description = models.TextField(null=True, blank=True, verbose_name="描述")
    create_time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    update_time = models.DateTimeField(auto_now=True, verbose_name="更新时间")

    class Meta:
        db_table = "flaxdb_regions"
        verbose_name = "区域"
        verbose_name_plural = "区域"
        ordering = ['name']

    def __str__(self):
        return self.name


# 品种信息表
class Variety(models.Model):
    name = models.CharField(max_length=100, verbose_name="品种名称")
    variety_code = models.CharField(max_length=50, unique=True, verbose_name="品种代码")
    region = models.ForeignKey(Region, on_delete=models.SET_NULL, null=True, blank=True, related_name="varieties", verbose_name="所属区域")
    seed_color = models.CharField(max_length=50, null=True, blank=True, verbose_name="种子颜色")
    oil_content = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, verbose_name="含油量(%)")
    maturity_days = models.IntegerField(null=True, blank=True, verbose_name="成熟期(天)")
    yield_per_hectare = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name="产量(公斤/公顷)")
    height = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True, verbose_name="株高(cm)")
    description = models.TextField(null=True, blank=True, verbose_name="描述")
    create_time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    update_time = models.DateTimeField(auto_now=True, verbose_name="更新时间")

    class Meta:
        db_table = "flaxdb_varieties"
        verbose_name = "品种"
        verbose_name_plural = "品种"
        ordering = ['name']

    def __str__(self):
        return self.name


class NutritionData(models.Model):
    variety = models.ForeignKey(Variety, on_delete=models.CASCADE, related_name="nutrition_records", verbose_name="品种")
    sample_code = models.CharField(max_length=100, verbose_name="样品编号")
    oil_content = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True, verbose_name="含油量(%)")
    protein = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True, verbose_name="蛋白质(%)")
    fatty_acid = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True, verbose_name="特征脂肪酸(%)")
    lignan = models.DecimalField(max_digits=8, decimal_places=3, null=True, blank=True, verbose_name="特征营养成分")
    moisture = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True, verbose_name="水分(%)")
    method = models.CharField(max_length=100, default="HPLC/NIR", verbose_name="检测方法")
    test_date = models.DateField(null=True, blank=True, verbose_name="检测日期")
    create_time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    update_time = models.DateTimeField(auto_now=True, verbose_name="更新时间")

    class Meta:
        db_table = "flaxdb_nutrition_data"
        verbose_name = "营养数据"
        verbose_name_plural = "营养数据"
        ordering = ['-test_date', 'sample_code']
        unique_together = [['variety', 'sample_code']]

    def __str__(self):
        return f"{self.variety.name} - {self.sample_code}"


# 基因信息表
class Gene(models.Model):
    gene_id = models.CharField(max_length=50, unique=True, verbose_name="基因ID")
    name = models.CharField(max_length=200, verbose_name="基因名称")
    symbol = models.CharField(max_length=50, null=True, blank=True, verbose_name="基因符号")
    chromosome = models.CharField(max_length=20, null=True, blank=True, verbose_name="染色体")
    start_position = models.BigIntegerField(null=True, blank=True, verbose_name="起始位置")
    end_position = models.BigIntegerField(null=True, blank=True, verbose_name="结束位置")
    strand = models.CharField(max_length=10, null=True, blank=True, verbose_name="链方向")
    gene_type = models.CharField(max_length=50, null=True, blank=True, verbose_name="基因类型")
    description = models.TextField(null=True, blank=True, verbose_name="描述")
    function = models.TextField(null=True, blank=True, verbose_name="功能")
    pathway = models.CharField(max_length=200, null=True, blank=True, verbose_name="所属通路")
    create_time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    update_time = models.DateTimeField(auto_now=True, verbose_name="更新时间")

    class Meta:
        db_table = "flaxdb_genes"
        verbose_name = "基因"
        verbose_name_plural = "基因"
        ordering = ['gene_id']

    def __str__(self):
        return f"{self.gene_id} - {self.name}"


# 基因表达数据表
class GeneExpression(models.Model):
    gene = models.ForeignKey(Gene, on_delete=models.CASCADE, related_name="expressions", verbose_name="基因")
    variety = models.ForeignKey(Variety, on_delete=models.CASCADE, related_name="gene_expressions", verbose_name="品种")
    tissue = models.CharField(max_length=100, verbose_name="组织")
    stage = models.CharField(max_length=100, null=True, blank=True, verbose_name="发育阶段")
    expression_value = models.DecimalField(max_digits=10, decimal_places=4, verbose_name="表达值")
    fpkm = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True, verbose_name="FPKM值")
    tpm = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True, verbose_name="TPM值")
    sample_id = models.CharField(max_length=100, null=True, blank=True, verbose_name="样本ID")
    create_time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    update_time = models.DateTimeField(auto_now=True, verbose_name="更新时间")

    class Meta:
        db_table = "flaxdb_gene_expression"
        verbose_name = "基因表达"
        verbose_name_plural = "基因表达"
        ordering = ['-create_time']
        unique_together = [['gene', 'variety', 'tissue', 'stage']]

    def __str__(self):
        return f"{self.gene.gene_id} - {self.variety.name} - {self.tissue}"


# 基因关联网络表
class GeneAssociation(models.Model):
    ASSOCIATION_TYPE_CHOICES = [
        ("coexpression", "共表达"),
        ("gwas", "GWAS关联"),
        ("pathway", "通路关联"),
        ("ppi", "蛋白互作"),
        ("literature", "文献证据"),
        ("trait", "性状关联"),
    ]

    source_gene = models.ForeignKey(Gene, on_delete=models.CASCADE, related_name="source_associations", verbose_name="源基因")
    target_gene = models.ForeignKey(Gene, on_delete=models.SET_NULL, null=True, blank=True, related_name="target_associations", verbose_name="目标基因")
    target_trait = models.CharField(max_length=200, null=True, blank=True, verbose_name="目标性状/通路")
    association_type = models.CharField(max_length=50, choices=ASSOCIATION_TYPE_CHOICES, default="coexpression", verbose_name="关联类型")
    confidence_score = models.DecimalField(max_digits=6, decimal_places=4, default=0, verbose_name="置信度")
    p_value = models.DecimalField(max_digits=12, decimal_places=8, null=True, blank=True, verbose_name="P值")
    effect_size = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True, verbose_name="效应值")
    evidence_source = models.CharField(max_length=200, null=True, blank=True, verbose_name="证据来源")
    description = models.TextField(null=True, blank=True, verbose_name="关联说明")
    is_active = models.BooleanField(default=True, verbose_name="是否展示")
    create_time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    update_time = models.DateTimeField(auto_now=True, verbose_name="更新时间")

    class Meta:
        db_table = "flaxdb_gene_associations"
        verbose_name = "基因关联"
        verbose_name_plural = "基因关联"
        ordering = ["-confidence_score", "source_gene__gene_id"]
        indexes = [
            models.Index(fields=["source_gene", "association_type"]),
            models.Index(fields=["is_active", "confidence_score"]),
        ]
        constraints = [
            models.UniqueConstraint(fields=["source_gene", "target_gene", "target_trait", "association_type"], name="flaxdb_unique_gene_association")
        ]

    def __str__(self):
        target = self.target_gene.gene_id if self.target_gene else self.target_trait
        return f"{self.source_gene.gene_id} -> {target or '未指定'}"


# 环境因子表
class EnvironmentalFactor(models.Model):
    name = models.CharField(max_length=100, verbose_name="因子名称")
    code = models.CharField(max_length=50, unique=True, verbose_name="因子代码")
    unit = models.CharField(max_length=50, verbose_name="单位")
    category = models.CharField(max_length=50, null=True, blank=True, verbose_name="类别")
    description = models.TextField(null=True, blank=True, verbose_name="描述")
    min_value = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True, verbose_name="最小值")
    max_value = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True, verbose_name="最大值")
    create_time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    update_time = models.DateTimeField(auto_now=True, verbose_name="更新时间")

    class Meta:
        db_table = "flaxdb_environmental_factors"
        verbose_name = "环境因子"
        verbose_name_plural = "环境因子"
        ordering = ['name']

    def __str__(self):
        return self.name



class RegionalMapSite(models.Model):
    region = models.ForeignKey(Region, on_delete=models.CASCADE, related_name="map_sites", verbose_name="关联区域")
    name = models.CharField(max_length=150, verbose_name="试验点名称")
    code = models.CharField(max_length=50, unique=True, verbose_name="试验点代码")
    province = models.CharField(max_length=80, verbose_name="地图省份名称")
    longitude = models.DecimalField(max_digits=9, decimal_places=5, verbose_name="经度")
    latitude = models.DecimalField(max_digits=8, decimal_places=5, verbose_name="纬度")
    varieties = models.ManyToManyField(Variety, blank=True, related_name="regional_map_sites", verbose_name="优势品种")
    trait = models.CharField(max_length=150, null=True, blank=True, verbose_name="优势性状")
    component = models.CharField(max_length=150, null=True, blank=True, verbose_name="功能成分")
    soil = models.CharField(max_length=150, null=True, blank=True, verbose_name="土壤类型")
    display_order = models.IntegerField(default=0, verbose_name="展示顺序")
    is_active = models.BooleanField(default=True, verbose_name="是否展示")
    description = models.TextField(null=True, blank=True, verbose_name="说明")
    create_time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    update_time = models.DateTimeField(auto_now=True, verbose_name="更新时间")

    class Meta:
        db_table = "flaxdb_regional_map_sites"
        verbose_name = "区域优势地图点"
        verbose_name_plural = "区域优势地图点"
        ordering = ["display_order", "province", "name"]

    def __str__(self):
        return f"{self.province} - {self.name}"


class RegionalEnvironmentValue(models.Model):
    site = models.ForeignKey(RegionalMapSite, on_delete=models.CASCADE, related_name="environment_values", verbose_name="地图点")
    factor = models.ForeignKey(EnvironmentalFactor, on_delete=models.CASCADE, related_name="regional_values", verbose_name="环境因子")
    value_min = models.DecimalField(max_digits=10, decimal_places=3, null=True, blank=True, verbose_name="最小值")
    value_max = models.DecimalField(max_digits=10, decimal_places=3, null=True, blank=True, verbose_name="最大值")
    display_value = models.CharField(max_length=100, null=True, blank=True, verbose_name="展示值")
    note = models.CharField(max_length=200, null=True, blank=True, verbose_name="备注")
    create_time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    update_time = models.DateTimeField(auto_now=True, verbose_name="更新时间")

    class Meta:
        db_table = "flaxdb_regional_environment_values"
        verbose_name = "区域环境因子值"
        verbose_name_plural = "区域环境因子值"
        unique_together = [["site", "factor"]]
        ordering = ["site__display_order", "factor__category", "factor__name"]

    def __str__(self):
        return f"{self.site.name} - {self.factor.name}"


class MarkerLocus(models.Model):
    MARKER_TYPE_CHOICES = [
        ("SSR", "SSR"),
        ("SNP", "SNP"),
        ("INDEL", "INDEL"),
        ("KASP", "KASP"),
        ("EST-SSR", "EST-SSR"),
        ("gSSR", "gSSR"),
    ]

    marker_id = models.CharField(max_length=100, unique=True, verbose_name="标记ID")
    marker_name = models.CharField(max_length=100, null=True, blank=True, verbose_name="标记名称")
    marker_type = models.CharField(max_length=20, choices=MARKER_TYPE_CHOICES, verbose_name="标记类型")
    chromosome = models.CharField(max_length=20, null=True, blank=True, verbose_name="染色体")
    position = models.PositiveIntegerField(null=True, blank=True, verbose_name="基因组位置(bp)")
    forward_primer = models.TextField(null=True, blank=True, verbose_name="正向引物")
    reverse_primer = models.TextField(null=True, blank=True, verbose_name="反向引物")
    expected_size = models.CharField(max_length=50, null=True, blank=True, verbose_name="预期片段大小")
    reference_allele = models.CharField(max_length=200, null=True, blank=True, verbose_name="参考等位基因")
    alternate_allele = models.CharField(max_length=200, null=True, blank=True, verbose_name="替代等位基因")
    annotated_gene = models.CharField(max_length=100, null=True, blank=True, verbose_name="注释基因ID")
    associated_trait = models.CharField(max_length=200, null=True, blank=True, verbose_name="关联性状")
    polymorphism_rate = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True, verbose_name="多态率(%)")
    pic = models.DecimalField(max_digits=6, decimal_places=3, null=True, blank=True, verbose_name="PIC值")
    notes = models.TextField(null=True, blank=True, verbose_name="备注")
    create_time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    update_time = models.DateTimeField(auto_now=True, verbose_name="更新时间")

    class Meta:
        db_table = "flaxdb_marker_loci"
        verbose_name = "分子标记位点"
        verbose_name_plural = "分子标记位点"
        ordering = ["marker_type", "chromosome", "position", "marker_id"]

    def __str__(self):
        return self.marker_id


class MolecularFingerprint(models.Model):
    variety = models.ForeignKey(Variety, on_delete=models.CASCADE, related_name="molecular_fingerprints", verbose_name="品种")
    marker = models.ForeignKey(MarkerLocus, to_field="marker_id", db_column="marker_id", on_delete=models.CASCADE, related_name="fingerprints", verbose_name="标记")
    allele1 = models.CharField(max_length=200, null=True, blank=True, verbose_name="等位基因1")
    allele2 = models.CharField(max_length=200, null=True, blank=True, verbose_name="等位基因2")
    genotype_code = models.CharField(max_length=50, null=True, blank=True, verbose_name="基因型编码")
    fragment_size = models.CharField(max_length=50, null=True, blank=True, verbose_name="片段大小")
    quality_score = models.PositiveSmallIntegerField(null=True, blank=True, verbose_name="质量评分")
    notes = models.TextField(null=True, blank=True, verbose_name="备注")
    create_time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    update_time = models.DateTimeField(auto_now=True, verbose_name="更新时间")

    class Meta:
        db_table = "flaxdb_molecular_fingerprints"
        verbose_name = "分子指纹"
        verbose_name_plural = "分子指纹"
        unique_together = [["variety", "marker"]]
        ordering = ["variety__name", "marker__marker_id"]

    def __str__(self):
        return f"{self.variety.name} - {self.marker.marker_id}"


class SequencingData(models.Model):
    DATA_TYPE_CHOICES = [
        ("WGS", "全基因组测序"),
        ("RNA-seq", "转录组测序"),
        ("WGBS", "全基因组甲基化"),
        ("ChIP-seq", "ChIP-seq"),
        ("RAD-seq", "RAD-seq"),
        ("GBS", "GBS"),
    ]

    variety = models.ForeignKey(Variety, on_delete=models.CASCADE, related_name="sequencing_records", verbose_name="品种")
    accession_number = models.CharField(max_length=100, null=True, blank=True, verbose_name="数据库登录号")
    data_type = models.CharField(max_length=20, choices=DATA_TYPE_CHOICES, verbose_name="测序类型")
    platform = models.CharField(max_length=100, null=True, blank=True, verbose_name="测序平台")
    read_length = models.PositiveIntegerField(null=True, blank=True, verbose_name="读长(bp)")
    coverage = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True, verbose_name="测序深度(X)")
    total_reads = models.CharField(max_length=50, null=True, blank=True, verbose_name="总reads数")
    raw_data_size = models.CharField(max_length=50, null=True, blank=True, verbose_name="原始数据大小")
    clean_data_size = models.CharField(max_length=50, null=True, blank=True, verbose_name="过滤后数据大小")
    mapping_rate = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True, verbose_name="比对率(%)")
    reference_genome = models.CharField(max_length=100, null=True, blank=True, verbose_name="参考基因组")
    snp_count = models.PositiveIntegerField(null=True, blank=True, verbose_name="SNP数量")
    indel_count = models.PositiveIntegerField(null=True, blank=True, verbose_name="INDEL数量")
    data_url = models.URLField(null=True, blank=True, verbose_name="数据链接")
    public_database = models.CharField(max_length=100, null=True, blank=True, verbose_name="公共数据库")
    submission_date = models.DateField(null=True, blank=True, verbose_name="提交日期")
    notes = models.TextField(null=True, blank=True, verbose_name="备注")
    create_time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    update_time = models.DateTimeField(auto_now=True, verbose_name="更新时间")

    class Meta:
        db_table = "flaxdb_sequencing_data"
        verbose_name = "测序数据"
        verbose_name_plural = "测序数据"
        ordering = ["-submission_date", "variety__name"]

    def __str__(self):
        return f"{self.variety.name} - {self.data_type}"


class GermplasmResource(models.Model):
    GERMPLASM_TYPE_CHOICES = [
        ("cultivar", "栽培种"),
        ("landrace", "地方品种"),
        ("wild_species", "野生种"),
        ("breeding_line", "育种材料"),
        ("mutant", "突变体"),
    ]
    RESISTANCE_CHOICES = [
        ("high", "强"),
        ("medium", "中"),
        ("low", "弱"),
        ("unknown", "未知"),
    ]

    variety = models.OneToOneField(Variety, on_delete=models.CASCADE, related_name="germplasm_resource", verbose_name="品种")
    germplasm_number = models.CharField(max_length=100, null=True, blank=True, verbose_name="种质编号")
    germplasm_type = models.CharField(max_length=30, choices=GERMPLASM_TYPE_CHOICES, default="cultivar", verbose_name="种质类型")
    collection_site = models.CharField(max_length=200, null=True, blank=True, verbose_name="采集地点")
    collection_year = models.PositiveIntegerField(null=True, blank=True, verbose_name="采集年份")
    donor_institution = models.CharField(max_length=200, null=True, blank=True, verbose_name="提供机构")
    ploidy = models.CharField(max_length=50, null=True, blank=True, verbose_name="倍性")
    genome_size = models.CharField(max_length=50, null=True, blank=True, verbose_name="基因组大小")
    chromosome_number = models.PositiveIntegerField(null=True, blank=True, verbose_name="染色体数目")
    plant_height = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True, verbose_name="株高(cm)")
    branch_number = models.PositiveIntegerField(null=True, blank=True, verbose_name="分枝数")
    capsule_number = models.PositiveIntegerField(null=True, blank=True, verbose_name="蒴果数")
    seeds_per_capsule = models.PositiveIntegerField(null=True, blank=True, verbose_name="每蒴粒数")
    thousand_seed_weight = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True, verbose_name="千粒重(g)")
    seed_coat_color = models.CharField(max_length=50, null=True, blank=True, verbose_name="种皮颜色")
    flower_color = models.CharField(max_length=50, null=True, blank=True, verbose_name="花色")
    stem_color = models.CharField(max_length=50, null=True, blank=True, verbose_name="茎色")
    disease_resistance = models.CharField(max_length=200, null=True, blank=True, verbose_name="病害抗性")
    drought_resistance = models.CharField(max_length=20, choices=RESISTANCE_CHOICES, default="unknown", verbose_name="抗旱性")
    fingerprint_profile = models.TextField(null=True, blank=True, verbose_name="指纹摘要")
    has_molecular_data = models.BooleanField(default=False, verbose_name="有分子数据")
    has_sequencing_data = models.BooleanField(default=False, verbose_name="有测序数据")
    notes = models.TextField(null=True, blank=True, verbose_name="备注")
    create_time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    update_time = models.DateTimeField(auto_now=True, verbose_name="更新时间")

    class Meta:
        db_table = "flaxdb_germplasm_resources"
        verbose_name = "种质资源"
        verbose_name_plural = "种质资源"
        ordering = ["variety__name"]

    def __str__(self):
        return self.germplasm_number or self.variety.name


class GeneticDiversityAnalysis(models.Model):
    ANALYSIS_TYPE_CHOICES = [
        ("PCA", "PCA"),
        ("clustering", "聚类分析"),
        ("phylogenetic", "系统发育"),
        ("structure", "群体结构"),
        ("AMOVA", "AMOVA"),
        ("kinship", "亲缘关系"),
    ]

    analysis_name = models.CharField(max_length=200, verbose_name="分析名称")
    analysis_type = models.CharField(max_length=30, choices=ANALYSIS_TYPE_CHOICES, verbose_name="分析类型")
    marker_type = models.CharField(max_length=50, null=True, blank=True, verbose_name="标记类型")
    marker_count = models.PositiveIntegerField(null=True, blank=True, verbose_name="标记数量")
    variety_count = models.PositiveIntegerField(null=True, blank=True, verbose_name="品种数量")
    result_data = models.TextField(null=True, blank=True, verbose_name="结果数据")
    result_image_url = models.URLField(null=True, blank=True, verbose_name="结果图片URL")
    description = models.TextField(null=True, blank=True, verbose_name="描述")
    analysis_date = models.DateField(null=True, blank=True, verbose_name="分析日期")
    create_time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    update_time = models.DateTimeField(auto_now=True, verbose_name="更新时间")

    class Meta:
        db_table = "flaxdb_genetic_diversity_analysis"
        verbose_name = "遗传多样性分析"
        verbose_name_plural = "遗传多样性分析"
        ordering = ["-analysis_date", "-create_time"]

    def __str__(self):
        return self.analysis_name


# 合作机构表
class Institution(models.Model):
    name = models.CharField(max_length=200, unique=True, verbose_name="机构名称")
    abbreviation = models.CharField(max_length=50, null=True, blank=True, verbose_name="简称")
    country = models.CharField(max_length=100, verbose_name="国家")
    city = models.CharField(max_length=100, null=True, blank=True, verbose_name="城市")
    address = models.TextField(null=True, blank=True, verbose_name="地址")
    website = models.URLField(null=True, blank=True, verbose_name="网站")
    email = models.EmailField(null=True, blank=True, verbose_name="邮箱")
    phone = models.CharField(max_length=50, null=True, blank=True, verbose_name="电话")
    contact_person = models.CharField(max_length=100, null=True, blank=True, verbose_name="联系人")
    description = models.TextField(null=True, blank=True, verbose_name="描述")
    institution_type = models.CharField(max_length=50, null=True, blank=True, verbose_name="机构类型")
    create_time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    update_time = models.DateTimeField(auto_now=True, verbose_name="更新时间")

    class Meta:
        db_table = "flaxdb_institutions"
        verbose_name = "合作机构"
        verbose_name_plural = "合作机构"
        ordering = ['name']

    def __str__(self):
        return self.name


# 动态公告表
class Announcement(models.Model):
    title = models.CharField(max_length=200, verbose_name="标题")
    content = models.TextField(verbose_name="内容")
    announcement_type = models.CharField(max_length=50, verbose_name="类型")
    author = models.CharField(max_length=100, null=True, blank=True, verbose_name="发布人")
    institution = models.ForeignKey(Institution, on_delete=models.SET_NULL, null=True, blank=True, related_name="announcements", verbose_name="关联机构")
    importance = models.CharField(max_length=20, default="normal", verbose_name="重要程度")
    attachment_url = models.URLField(null=True, blank=True, verbose_name="附件链接")
    is_published = models.BooleanField(default=True, verbose_name="是否发布")
    publish_date = models.DateField(null=True, blank=True, verbose_name="发布日期")
    expire_date = models.DateField(null=True, blank=True, verbose_name="过期日期")
    views = models.IntegerField(default=0, verbose_name="浏览量")
    create_time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    update_time = models.DateTimeField(auto_now=True, verbose_name="更新时间")

    class Meta:
        db_table = "flaxdb_announcements"
        verbose_name = "动态公告"
        verbose_name_plural = "动态公告"
        ordering = ['-publish_date', '-create_time']

    def __str__(self):
        return self.title


# 新闻表
class News(models.Model):
    title = models.CharField(max_length=200, verbose_name="标题")
    content = models.TextField(verbose_name="内容")
    author = models.CharField(max_length=100, null=True, blank=True, verbose_name="作者")
    image = models.ImageField(upload_to='news_images', null=True, blank=True, verbose_name="封面图片")
    category = models.CharField(max_length=50, null=True, blank=True, verbose_name="分类")
    tags = models.CharField(max_length=200, null=True, blank=True, verbose_name="标签")
    views = models.IntegerField(default=0, verbose_name="浏览量")
    is_published = models.BooleanField(default=True, verbose_name="是否发布")
    is_scrolling = models.BooleanField(default=False, verbose_name="是否滚动显示")
    create_time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    update_time = models.DateTimeField(auto_now=True, verbose_name="更新时间")
    publish_time = models.DateTimeField(null=True, blank=True, verbose_name="发布时间")

    class Meta:
        db_table = "flaxdb_news"
        verbose_name = "新闻"
        verbose_name_plural = "新闻"
        ordering = ['-publish_time', '-create_time']

    def __str__(self):
        return self.title


# 更新记录表
class Changelog(models.Model):
    version = models.CharField(max_length=50, verbose_name="版本号")
    title = models.CharField(max_length=200, verbose_name="标题")
    content = models.TextField(verbose_name="更新内容")
    changes = models.JSONField(default=list, verbose_name="变更列表")
    release_date = models.DateField(verbose_name="发布日期")
    is_published = models.BooleanField(default=True, verbose_name="是否发布")
    create_time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")

    class Meta:
        db_table = "flaxdb_changelog"
        verbose_name = "更新记录"
        verbose_name_plural = "更新记录"
        ordering = ['-release_date']

    def __str__(self):
        return f"{self.version} - {self.title}"


class EventRegistration(models.Model):
    ATTENDANCE_CHOICES = [
        ("online", "线上参会"),
        ("offline", "线下参会"),
        ("undecided", "待确定"),
    ]
    STATUS_CHOICES = [
        ("pending", "待联系"),
        ("confirmed", "已确认"),
        ("cancelled", "已取消"),
    ]

    event_id = models.CharField(max_length=120, verbose_name="活动标识")
    event_title = models.CharField(max_length=240, verbose_name="活动名称")
    event_date = models.CharField(max_length=120, null=True, blank=True, verbose_name="活动日期")
    event_location = models.CharField(max_length=200, null=True, blank=True, verbose_name="活动地点")
    name = models.CharField(max_length=80, verbose_name="姓名")
    institution = models.CharField(max_length=200, verbose_name="单位/机构")
    email = models.EmailField(verbose_name="邮箱")
    phone = models.CharField(max_length=50, null=True, blank=True, verbose_name="电话")
    attendance_mode = models.CharField(max_length=20, choices=ATTENDANCE_CHOICES, default="undecided", verbose_name="参会方式")
    participant_count = models.PositiveIntegerField(default=1, verbose_name="参会人数")
    note = models.TextField(null=True, blank=True, verbose_name="备注")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending", verbose_name="处理状态")
    create_time = models.DateTimeField(auto_now_add=True, verbose_name="提交时间")
    update_time = models.DateTimeField(auto_now=True, verbose_name="更新时间")

    class Meta:
        db_table = "flaxdb_event_registrations"
        verbose_name = "参会意向"
        verbose_name_plural = "参会意向"
        ordering = ["-create_time"]
        indexes = [
            models.Index(fields=["event_id", "email"]),
            models.Index(fields=["status", "create_time"]),
        ]

    def __str__(self):
        return f"{self.name} - {self.event_title}"


