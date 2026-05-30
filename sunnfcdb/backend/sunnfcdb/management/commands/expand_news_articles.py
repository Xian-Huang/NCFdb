from django.core.management.base import BaseCommand

from sunnfcdb.models import News


TOPICS = {
    "向日葵多组学数据库完成独立部署": {
        "focus": "向日葵多组学数据库完成独立部署",
        "deliverable": "营养品质、基因组、蛋白组和重测序资源的稳定服务环境",
        "users": "需要比较分子证据与籽粒品质观测结果的研究团队",
        "next_step": "继续测试查询速度、归档部署检查记录，并收集用户对跨数据集导航的反馈",
    },
    "向日葵核心种质资源数据集上线": {
        "focus": "向日葵核心种质资源数据集上线",
        "deliverable": "与区域、品种、油分品质和农艺性状关联的标准化种质记录",
        "users": "筛选营养品质评价材料的育种人员和数据管理员",
        "next_step": "扩展已核验表型字段，并补充新增种质的来源说明",
    },
    "向日葵候选基因注释结果完成更新": {
        "focus": "向日葵候选基因注释结果完成更新",
        "deliverable": "经复核的功能描述、通路信息、染色体位置和表达证据链接",
        "users": "研究油分组成、籽粒发育和环境响应机制的科研人员",
        "next_step": "继续开展人工注释复核，并连接更多变异位点与实验证据支持的性状",
    },
    "向日葵环境因子与表型关联模块开放测试": {
        "focus": "向日葵环境因子与表型关联模块开放测试",
        "deliverable": "可与品种和营养测定结果共同浏览的气候与田间描述字段",
        "users": "评价不同产区适应性、稳定性和品质表现的田间研究人员",
        "next_step": "收集测试反馈、优化比较视图，并扩展环境元数据说明",
    },
    "向日葵下载中心新增示例文件": {
        "focus": "向日葵下载中心新增示例文件",
        "deliverable": "用于下游分析准备的示例数据集和元数据模板",
        "users": "初次使用数据库的用户、教学人员和需要准备标准输入文件的分析人员",
        "next_step": "发布更多格式说明，并将示例包与后续资源发布保持一致",
    },
    "向日葵营养品质检测批次完成入库": {
        "focus": "向日葵营养品质检测批次完成入库",
        "deliverable": "经过质控的油分、蛋白、脂肪酸和籽粒相关性状测定结果",
        "users": "筛选营养价值和育种目标材料的研究人员",
        "next_step": "开展跨批次比较，并将核验后的测定值连接到对应种质和试验地点",
    },
    "向日葵合作机构资料完成标准化": {
        "focus": "向日葵合作机构资料完成标准化",
        "deliverable": "统一的机构简介和联系人元数据，用于追踪数据贡献来源",
        "users": "协调数据审核、田间来源和共享成果的项目成员",
        "next_step": "确认联系方式更新，并将机构贡献与已发布数据集建立关联",
    },
    "向日葵年度数据审核工作流启动": {
        "focus": "向日葵年度数据审核工作流启动",
        "deliverable": "用于检查元数据完整性、测定一致性和发布准备状态的年度审核流程",
        "users": "负责可复用向日葵数据证据的数据管理员和研究团队",
        "next_step": "记录审核决定、处理标记问题，并形成已核验发布范围报告",
    },
}


def build_content(topic):
    return f"""SunNCFdb 发布“{topic["focus"]}”相关中文更新。本次进展提供{topic["deliverable"]}，帮助向日葵研究用户从数据库通知直接理解可使用的数据证据。向日葵品质研究需要同时关注种质身份、区域来源、营养测定、分子记录和数据整理决定，因此每条新闻都以完整项目说明的形式发布，方便{topic["users"]}判断资源是否适合自己的筛选、验证或教学工作。

发布前，项目组按照数据库整理流程检查了相关材料，包括术语一致性、样品编号、字段描述、资源分类和页面关联关系。对于包含观测数据的更新，管理员会确认用户是否能够从摘要信息追踪到对应的品种、区域、营养指标或分子数据；对于平台功能和文档更新，团队会检查其是否支持可重复使用和清晰解释。由于向日葵数据来自不同地点、不同管理条件和不同研究目的，数据库必须保留这些差异，才能支持谨慎比较。

用户浏览本条更新时，可先明确研究问题，再查看关联资源字段。关注籽粒品质的育种用户可比较种质、品种和营养指标；关注分子机制的用户可查看油脂合成、抗逆反应相关候选基因和表达证据；关注区域试验的用户可优先查看经纬度、温度、降水、光照、土壤和表型描述。数据库用于连接证据类别，但不会把相关性直接解释为因果关系，正式结论仍需统计分析、重复试验和独立验证。

本次更新也体现了项目对实用数据访问的持续维护。可检索记录和可下载资源只有在用户能快速理解范围、限制和复用条件时才有价值。因此，团队将标题、分类、标签、描述和关联视图组织成统一的中文表达，使用户能够判断记录属于新数据集、整理修订、分析服务、文档改进还是合作活动。后续团队将{topic["next_step"]}，并持续完善向日葵营养品质、功能成分、种质评价和分子育种相关数据。"""


class Command(BaseCommand):
    help = "Expand the existing SunNCFdb news records into multi-paragraph Chinese articles."

    def handle(self, *args, **options):
        updated = 0
        for title, topic in TOPICS.items():
            content = build_content(topic)
            char_count = sum(1 for char in content if "\u3400" <= char <= "\u9fff")
            if char_count < 180:
                raise ValueError(f"Article content for {title} has only {char_count} Chinese characters.")
            count = News.objects.filter(title=title).update(content=content)
            updated += count
            self.stdout.write(f"{title}: {char_count} Chinese characters ({count} record updated)")

        self.stdout.write(self.style.SUCCESS(f"Expanded content for {updated} news records."))
