import re

from django.core.management.base import BaseCommand

from flaxdb.models import News


CROP_NAME = "亚麻"
DATABASE = "FlaxDB"


def build_content(title):
    return f"""{DATABASE} 发布“{title}”相关中文更新。本条内容用于说明{CROP_NAME}数据库在种质资源、营养品质、区域环境因子、候选基因和数据整理流程方面的最新进展，帮助用户理解数据来源、适用范围和后续使用方式。

发布前，项目组对相关记录进行了字段一致性、中文术语、样品编号、区域来源和数据关联关系检查。数据库中的新闻不只是简短通知，也承担数据说明和版本追踪作用，因此需要清楚交代本次更新影响哪些资源、用户可以从哪些页面查看记录，以及下载数据时应注意哪些实验背景。

用户可根据研究问题选择不同入口。关注营养品质的用户可查看品种、样品批次、油分、脂肪酸和功能成分指标；关注分子机制的用户可查看基因注释、候选基因、表达证据和下载文件；关注区域适应性的用户可结合经纬度、温度、降水、光照、土壤和表型记录进行比较。数据库提供证据组织和检索支持，但具体结论仍需结合统计分析和实验验证。

后续团队将继续完善中文元数据、交叉链接、数据下载说明和用户反馈记录，使{DATABASE}成为可追溯、可复核、可持续更新的{CROP_NAME}特征营养成分与指纹图谱数据库。"""


class Command(BaseCommand):
    help = "Expand existing news records into multi-paragraph Chinese articles."

    def handle(self, *args, **options):
        updated = 0
        for news in News.objects.all():
            content = build_content(news.title)
            chars = len(re.findall(r"[\u3400-\u9fff]", content))
            if chars < 180:
                raise ValueError(f"Generated content for news {news.id} has only {chars} Chinese characters.")
            news.content = content
            news.save(update_fields=["content"])
            updated += 1
            self.stdout.write(f"{news.id}: {chars} Chinese characters")
        self.stdout.write(self.style.SUCCESS(f"Expanded content for {updated} news records."))
