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