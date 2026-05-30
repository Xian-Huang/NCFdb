from django.core.management.base import BaseCommand
from django.utils import timezone

from flaxdb.models import Announcement, Changelog, News


CROP_NAME = "亚麻"
DATABASE = "FlaxDB"
NEWS_IMAGES = [
    "news_images/flax-genome-release.png",
    "news_images/flax-nutrition-release.png",
    "news_images/flax-field-trial.png",
]
NEWS_TOPICS = [
    ("高α-亚麻酸亚麻新品系完成入库", "高α-亚麻酸材料、油分数据和区域来源"),
    ("亚麻功能成分与种质资源会议通知", "种质资源共享、品质评价和数据库使用培训"),
    ("亚麻参考基因组与注释数据更新", "候选基因、基因组注释和下载文件"),
]


def article(title, focus):
    return (
        f"{DATABASE} 发布“{title}”中文内容。本次更新围绕{CROP_NAME}的{focus}展开，"
        "用于帮助科研人员、育种团队和数据管理人员理解数据来源、适用范围和后续使用方式。\n\n"
        "项目组已对样品编号、品种名称、区域来源、检测指标、中文术语和关联字段进行整理，"
        "并保留必要的实验背景说明。用户在比较不同材料时，可结合经纬度、温度、降水、"
        "光照、土壤和表型记录判断数据是否具有可比性。\n\n"
        f"后续团队将继续完善{CROP_NAME}特征营养成分、分子指纹图谱占位、候选基因说明和下载说明，"
        f"使{DATABASE}成为可追溯、可复核、可持续更新的中文数据库资源。"
    )


def news_item(index):
    title, focus = NEWS_TOPICS[index % len(NEWS_TOPICS)]
    if index >= len(NEWS_TOPICS):
        title = f"{CROP_NAME}数据资源中文说明 {index + 1}"
    return {
        "title": title,
        "content": article(title, focus),
        "author": "数据库项目组",
        "image": NEWS_IMAGES[index % len(NEWS_IMAGES)],
        "category": "研究进展" if index % 3 != 1 else "活动",
        "tags": f"{CROP_NAME},功能成分,种质资源,中文数据",
        "is_published": True,
        "is_scrolling": index < 2,
        "publish_time": timezone.now(),
    }


class Command(BaseCommand):
    help = "Localize news, announcements, and changelog records to Chinese."

    def handle(self, *args, **options):
        now = timezone.now()
        news_records = list(News.objects.order_by("id"))
        if not news_records:
            news_records = [News() for _ in NEWS_TOPICS]
        for index, record in enumerate(news_records):
            for field, value in news_item(index).items():
                setattr(record, field, value)
            record.save()

        changelog_content = f"{DATABASE} 已切换为中文默认页面，并补充区域环境因子地图、分子指纹图谱框架和中文内容校验规则。"
        changelog_records = list(Changelog.objects.order_by("id")) or [Changelog(version="v1.0.0")]
        for record in changelog_records:
            record.version = record.version or "v1.0.0"
            record.title = "中文默认内容与功能框架更新"
            record.content = changelog_content
            record.changes = ["默认语言切换为中文", "新闻与公告内容中文化", "保留英文翻译占位", "新增地图与分子指纹图谱框架"]
            record.release_date = timezone.localdate()
            record.is_published = True
            record.save()

        announcement_content = f"{DATABASE} 将默认展示中文内容。近期活动围绕{CROP_NAME}区域优势品种、环境因子、功能成分和数据库使用开展，英文翻译占位保留，后续可逐步补齐。"
        announcement_records = list(Announcement.objects.order_by("id")) or [Announcement()]
        for record in announcement_records:
            record.title = f"{CROP_NAME}数据库中文内容与活动安排"
            record.content = announcement_content
            record.announcement_type = "活动"
            record.author = "数据库项目组"
            record.importance = "normal"
            record.is_published = True
            record.publish_date = timezone.localdate()
            record.save()

        self.stdout.write(self.style.SUCCESS(
            f"Localized {len(news_records)} news, {len(changelog_records)} changelog, and {len(announcement_records)} announcement records at {now:%Y-%m-%d %H:%M}."
        ))
