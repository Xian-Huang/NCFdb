from django.db import models
import os
from django.conf import settings

# Create your models here.
class DownloadFile(models.Model):
    title = models.CharField(max_length=100,unique=True,verbose_name="文件名",blank=True)
    description = models.TextField(null=True,blank=True,verbose_name="文件描述")
    size = models.BigIntegerField(null=True,blank=True,verbose_name="文件大小")
    format = models.CharField(max_length=100,null=True,blank=True,verbose_name="文件格式")
    downloads = models.IntegerField(default=0,verbose_name="下载次数")
    create_time = models.DateTimeField(auto_now_add=True,verbose_name="创建时间")
    update_time = models.DateTimeField(auto_now=True,verbose_name="更新时间")
    version = models.CharField(max_length=100,null=True,blank=True,verbose_name="文件版本")
    
    
    @property
    def path(self):
        return os.path.join(settings.MEDIA_ROOT,"sunnfcdb","download_files",self.title)
        
    @property
    def file_url(self):
        #构建meida url 
        return f"{settings.MEDIA_URL}sunnfcdb/download_files/{self.title}"
    
    class Meta:
        db_table = "download_file"
        verbose_name = "下载文件"
        verbose_name_plural = "下载文件"

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
        db_table = "changelog"
        verbose_name = "更新记录"
        verbose_name_plural = "更新记录"
        ordering = ['-release_date']

    def __str__(self):
        return f"{self.version} - {self.title}"


# 创建营养表
class Nutrition(models.Model):
    name = models.CharField(max_length=100,unique=True,verbose_name="营养名称",blank=True)
    desc = models.TextField(null=True,verbose_name="营养描述",blank=True)
    create_time = models.DateTimeField(auto_now_add=True,verbose_name="创建时间",blank=True)
    update_time = models.DateTimeField(auto_now=True,verbose_name="更新时间",blank=True)

    class Meta:
        db_table = "nutrition"
        verbose_name = "营养"
        verbose_name_plural = "营养"

    def __str__(self):
        return self.name


class News(models.Model):
    title = models.CharField(max_length=200, verbose_name="标题",blank=True,null=True)
    content = models.TextField(verbose_name="内容",blank=True,null=True)
    author = models.CharField(max_length=100, null=True, blank=True, verbose_name="作者")
    image = models.URLField(null=True, blank=True, verbose_name="封面图片")
    category = models.CharField(max_length=50, null=True, blank=True, verbose_name="分类")
    tags = models.CharField(max_length=200, null=True, blank=True, verbose_name="标签")
    views = models.IntegerField(default=0, verbose_name="浏览量")
    is_published = models.BooleanField(default=True, verbose_name="是否发布")
    create_time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    update_time = models.DateTimeField(auto_now=True, verbose_name="更新时间")
    publish_time = models.DateTimeField(null=True, blank=True, verbose_name="发布时间")

    class Meta:
        db_table = "news"
        verbose_name = "新闻"
        verbose_name_plural = "新闻"
        ordering = ['-publish_time', '-create_time']

    def __str__(self):
        return self.title