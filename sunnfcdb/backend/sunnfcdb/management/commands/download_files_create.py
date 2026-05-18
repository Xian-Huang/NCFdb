# 创建下载文件命令
from django.core.management.base import BaseCommand
from sunnfcdb.models import DownloadFile
import os
import shutil


class Command(BaseCommand):
        help = "创建下载文件"

        def handle(self, *args, **options):
            DownloadFile.objects.all().delete()
            
            fileliststr = """
                            hap1.final.cds.fa:The coding sequence file of the hap1 gene in the SDM.
                            hap1.final.gff3:The coding sequence gff3 file of the hap1 gene in the SDM.
                            hap1.final.pep.fa:The protein sequence file of the hap1 gene in the SDM.
                            hap1.Trinotate_report.xls:Functional annotation file for the hap1 gene sequence in the SDM.
                            hap2.final.cds.fa:The coding sequence file of the hap2 gene in the SDM.
                            hap2.final.gff3:The coding sequence gff3 file of the hap2 gene in the SDM.
                            hap2.final.pep.fa:The protein sequence file of the hap2 gene in the SDM.
                            hap2.Trinotate_report.xls:Functional annotation file for the hap2 gene sequence in the SDM.
                            R_broomrape_exp:Gene expression profiles in sunflower germplasm resources among resistant and susceptible broomrape varieties.
                            sdm_hap1_2.vcf.gz:Variation between two haplotype genomes of the SDM.
                            Syn:Sunflower Genome Synteny
                            xrk_hap1.genome.fa:The haplotype 1 genome of SDM.
                            xrk_hap1.genome.fa.mod.EDTA.TEanno.gff3:Transposable element annotation results for haplotype 1 of SDM.
                            xrk_hap2.genome.fa:The haplotype 2 genome of SDM.
                            xrk_hap2.genome.fa.mod.EDTA.TEanno.gff3:Transposable element annotation results for haplotype 2 of SDM.
                            xrk-pan_genome.gfa:The haplotype pan-genome of SDM.
                            """
            filelist = fileliststr.split("\n")
            for line in filelist:
                if line.strip()=="":
                    continue
                line = line.strip()
                file_name, desc = line.split(":", 1)
                file_name = file_name.strip()
                desc = desc.strip()
                file_path = None
                #在目标文件夹搜索
                for root, dirs, files in os.walk("D:/BaiduNetdiskDownload/hap_genome_db"):
                    for file in files:
                        if file == file_name:
                            file_path = os.path.join(root, file)
                            break
                if not file_path:
                    continue
                # 获取文件大小
                size = os.path.getsize(file_path)
                # 移动到media目录下，自动创建文件夹 
                os.makedirs("./media/sunnfcdb/download_files", exist_ok=True)
                shutil.move(file_path, f"./media/sunnfcdb/download_files/{file_name}")
                print(file_path,"TO",f"media/sunnfcdb/download_files/{file_name}")
                format = file_name.split(".")[1]
                
                print(file_name, format, size, desc)
                DownloadFile.objects.create(
                    file_name=file_name,
                    format=format,
                    size=size,
                    download_count=0,
                    version="V0.1.0",
                    desc=desc,
                )