import os
from django.db import models

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


class News(models.Model):
    title = models.CharField(max_length=200, verbose_name="标题")
    content = models.TextField(verbose_name="内容")
    author = models.CharField(max_length=100, null=True, blank=True, verbose_name="作者")
    image = models.ImageField(upload_to='news_images', null=True, blank=True, verbose_name="封面图片")
    category = models.CharField(max_length=50, null=True, blank=True, verbose_name="分类")
    tags = models.CharField(max_length=200, null=True, blank=True, verbose_name="标签")
    views = models.IntegerField(default=0, verbose_name="浏览量")
    is_published = models.BooleanField(default=True, verbose_name="是否发布")
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
