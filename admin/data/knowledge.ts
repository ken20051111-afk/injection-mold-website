export type KnowledgeEntry = {
  category: string;
  title: string;
  content: string;
  sourceUrl?: string;
};

export const knowledgeBase: KnowledgeEntry[] = [
  {
    category: "company",
    title: "公司概况",
    content:
      "中国广东省东莞市勇鑫塑胶制品厂是一家位于中国东莞长安的注塑模具制造商，成立于 2006 年。我们每年为汽车、医疗、电子、包装和电动工具客户制造 1200 多套模具，服务全球 30 多个国家/地区，主要客户集中在中国及欧美市场。公司拥有 86 名工程师，运行 42 台 CNC 和放电加工设备。",
  },
  {
    category: "company",
    title: "资质认证",
    content:
      "勇鑫塑胶已通过 ISO 9001:2015、IATF 16949 和 ISO 14001 认证。汽车项目遵循 PPAP Level 3 和 IMDS。医疗模具按对标 ISO 13485 的文档标准生产，并支持生物相容性材料加工。",
  },
  {
    category: "company",
    title: "交付表现",
    content:
      "标准模具交期视尺寸与腔数为 3-6 周。试制模具最快 3-4 周交付。我们的准时交付率为 98%，并对约定的模次承诺模具寿命。",
  },
  {
    category: "company",
    title: "成立年份与历史",
    content:
      "勇鑫塑胶制品厂成立于 2006 年，位于广东省东莞市长安镇。经过近 20 年的发展，我们从一家小型模具车间成长为年产 1200 多套注塑模具的专业制造商。",
  },
  {
    category: "company",
    title: "工厂地址与位置",
    content:
      "工厂位于中国广东省东莞市长安镇，地处珠三角制造业核心区，交通便利，方便客户到厂参观、验模和物流发货。我们欢迎全球客户到厂考察。",
  },
  {
    category: "company",
    title: "工程团队规模",
    content:
      "公司拥有 86 名工程师，覆盖模具设计、模流分析、加工工艺、品质检验和项目管理等环节，能够在项目早期参与 DFM 评审，为量产扫清障碍。",
  },
  {
    category: "company",
    title: "车间与生产设施",
    content:
      "我们设有 2,500 平方米防尘车间、与量产一致的试模产线和带扭矩及气密检测工位的清洁装配台，7×24 小时运作，保障模具制造的交期与品质。",
  },
  {
    category: "company",
    title: "加工设备清单",
    content:
      "车间配备 18 台 CNC（Mazak 与 DMG MORI 五轴/三轴）、10 台放电加工设备（Charmilles、Sodick 慢走丝与成形）、6 台平面/成形磨床，以及 8 台检测设备（三坐标、光学测量、三维扫描）。",
  },
  {
    category: "company",
    title: "年产能",
    content:
      "我们每年制造约 1200 多套模具，覆盖汽车、医疗、电子、包装和电动工具等多个行业，能够同时并行管理大量项目而不会互相挤压交期。",
  },
  {
    category: "company",
    title: "出口与全球化",
    content:
      "产品出口到全球 30 多个国家/地区，主要客户集中在中国及欧美市场。我们熟悉欧美标准（如 VDA、IMDS）和国际贸易流程，能顺畅对接海外客户。",
  },
  {
    category: "company",
    title: "联系方式",
    content:
      "您可以通过网站的联系表单或邮件 sales@moldcraftprecision.com 与我们取得联系，我们的销售团队会在 24 小时内回复询价。",
  },
  {
    category: "company",
    title: "样品开发能力",
    content:
      "除了量产模具，我们也支持试制和小批量样品开发，最快 3-4 周交付单腔试制模具，帮助客户在产品开发早期验证设计和结构。",
  },
  {
    category: "company",
    title: "公司使命",
    content:
      "勇鑫塑胶的使命是为全球客户提供高性价比、可追溯、交期可靠的注塑模具与注塑代工服务，成为客户可长期信赖的模具合作伙伴。",
  },
  {
    category: "capability",
    title: "精密模具能力",
    content:
      "关键特征部位的型腔公差可控制在 ±0.005mm。最大模具尺寸 2,500 x 1,800 x 1,200 mm，最大模具重量 25 吨。交付前每套型腔均经过 CMM 三坐标检测。",
  },
  {
    category: "capability",
    title: "多腔模具",
    content:
      "我们制造 4-128 腔模具，配备 Husky、YUDO 或 Mold-Masters 平衡式热流道系统。单元式型腔结构无需拆整模即可更换单个型腔。64 腔瓶盖模具典型注塑周期为 3.8 秒。",
  },
  {
    category: "capability",
    title: "双色与包胶注塑",
    content:
      "双色与包胶模具在 120-700 吨双射注塑机转盘上生产。支持 TPE/TPU 包覆 PP、ABS 和 PC，以及 LSR 包胶。结合强度通过 T 型剥离试验验证。",
  },
  {
    category: "capability",
    title: "气辅注塑",
    content:
      "面向最大 1,500 mm 零件的气辅注塑，掏空率 25-45%。带筋外壳可节省 20-35% 材料，并消除缩痕。",
  },
  {
    category: "capability",
    title: "叠层模具",
    content:
      "用于薄壁包装的两层和三层叠层模具，每周期产出翻倍。典型应用为薄壁容器、盖子和盖类产品。",
  },
  {
    category: "capability",
    title: "薄壁成型",
    content:
      "消费电子行业要求薄壁成型能力，我们可稳定做到 0.4mm 级别的薄壁件，并对流动与翘曲进行模流分析控制。",
  },
  {
    category: "capability",
    title: "嵌件模塑",
    content:
      "支持金属嵌件（嵌件螺母、销钉、端子）的嵌件模塑工艺，将金属件与塑料一体成型，广泛用于汽车连接器和电动工具。",
  },
  {
    category: "capability",
    title: "高腔数热流道系统",
    content:
      "为高腔数模具配备平衡式热流道歧管，配合 Husky、YUDO 或 Mold-Masters 品牌，确保每腔充填与冷却均衡，提升良率。",
  },
  {
    category: "capability",
    title: "大尺寸模具",
    content:
      "可制造最大 2,500 x 1,800 x 1,200 mm、重达 25 吨的大型模具，适用于汽车保险杠、家电等大型注塑件。",
  },
  {
    category: "capability",
    title: "镜面抛光模具",
    content:
      "使用 NAK80 等可高抛光的钢种制作镜面外观件模具，面向消费电子和汽车内饰等对外观要求高的产品。",
  },
  {
    category: "process",
    title: "模具钢选择",
    content:
      "按产量推荐钢材：P20 用于 25 万次以内，718H 用于 100 万次以内，NAK80 用于高抛光外观模具，S136 淬硬钢用于腐蚀性树脂并支持最高 300 万次，H13 用于高温部位。",
  },
  {
    category: "process",
    title: "表面光洁度标准",
    content:
      "我们可制作 SPI A1-D3 光洁度以及 VDI 纹理。SPI A1 达到 0.012-0.025 um Ra，适用于光学表面。汽车内饰外观件通常采用 SPI B1。",
  },
  {
    category: "process",
    title: "可加工材料",
    content:
      "常用材料包括 ABS、PC、PC/ABS、PP、PA6/PA66（玻纤增强）、POM、PBT、PET、PMMA、TPU、TPE、PEEK 和 PPSU。我们还加工 LSR，用于医疗密封应用。",
  },
  {
    category: "process",
    title: "试模与试产",
    content:
      "我们在与量产一致的注塑机（80-1,500 吨）上试模。DOE 试模、尺寸报告和金样确认是模具出货前的标准流程。",
  },
  {
    category: "process",
    title: "DFM 评审",
    content:
      "项目启动时我们会做可制造性设计评审，检查壁厚、脱模斜度、浇口位置、倒扣和分模线等，提前消除会导致模具返工和成本超支的设计问题。",
  },
  {
    category: "process",
    title: "模流分析",
    content:
      "对复杂结构件我们会进行 CAE 模流分析，模拟充填、流动、冷却、翘曲和熔接线位置，预先优化浇注系统与冷却布局。",
  },
  {
    category: "process",
    title: "公差标准",
    content:
      "常规产品关键尺寸按 ±0.01 mm、常规尺寸 ±0.05 mm 控制；精密产品关键尺寸可达 ±0.005 mm、孔位 ±0.015 mm。具体以图纸标注为准。",
  },
  {
    category: "process",
    title: "脱模斜度建议",
    content:
      "一般情况建议 1-1.5 度脱模斜度，纹理面需 1.5-2 度，高光外观可稍小但不宜低于 0.5 度。斜度过小会导致顶出阻力和拉伤。",
  },
  {
    category: "process",
    title: "壁厚设计原则",
    content:
      "尽量保持壁厚均匀，避免厚薄骤变导致缩痕和翘曲。常见 2.5-4 mm 壁厚区间。壁厚突变处应设计渐变过渡。",
  },
  {
    category: "process",
    title: "浇口类型选择",
    content:
      "根据产品大小与外观要求可选择边浇口、点浇口、潜伏浇口、热流道浇口等。浇口位置影响熔接线、外观和填充平衡，DFM 阶段应确定。",
  },
  {
    category: "process",
    title: "冷却系统设计",
    content:
      "优良的随形冷却水道能显著缩短注塑周期、减少翘曲。我们对高产量模具做冷却优化，保障型腔温度均匀。",
  },
  {
    category: "process",
    title: "倒扣与滑块",
    content:
      "零件上的倒扣需要滑块或斜顶机构。设计阶段尽量减少倒扣以降低模具成本，因为每个滑块可能增加 8-12% 模具成本。",
  },
  {
    category: "process",
    title: "顶出系统",
    content:
      "根据零件结构与外观面要求选择顶针、顶块、司筒或液压顶出。对高光外观件需避免顶针印出现在外观面。",
  },
  {
    category: "process",
    title: "热处理与表面硬化",
    content:
      "根据寿命要求对模具钢进行淬硬与表面处理（氮化、镀铬、PVD），提升耐磨性与脱模性，延长模具使用寿命。",
  },
  {
    category: "process",
    title: "CMM 全检",
    content:
      "交付前每套型腔均经过三坐标测量机全检并出具尺寸报告，确保型腔特征尺寸符合图纸公差要求。",
  },
  {
    category: "process",
    title: "配模与装配",
    content:
      "装配阶段在带扭矩与气密检测工位的清洁装配台完成，确保滑块合模精度、顶出顺畅和气密性能达标。",
  },
  {
    category: "process",
    title: "DOE 试模",
    content:
      "我们采用 DOE（试验设计）方法系统化调整注塑参数，找出最优工艺窗口，减少试模次数并提升量产稳定性。",
  },
  {
    category: "process",
    title: "金样认可",
    content:
      "模具试模稳定后提供金样（首件批准样件），经客户确认尺寸与外观后方可安排出货，确保交付的是符合要求的产品。",
  },
  {
    category: "process",
    title: "样品全尺寸报告",
    content:
      "试模后我们提供全尺寸检测报告，逐项对照图纸尺寸与公差，让客户清晰了解样件与设计的一致性。",
  },
  {
    category: "process",
    title: "模次寿命承诺",
    content:
      "我们对约定的模具模次寿命做出书面承诺，按正确工艺使用可达到寿命目标，超出后仍可提供镶件替换方案继续服役。",
  },
  {
    category: "process",
    title: "S7 高冲击模具钢",
    content:
      "对于承受高冲击、易断裂的模具结构，我们推荐 S7（46-50 HRC）高冲击钢，适合受力苛刻的型芯与镶件。",
  },
  {
    category: "process",
    title: "隔热与温控",
    content:
      "高温树脂或精密零件对模温敏感，我们可配置模温机与隔热板，精确控制型腔温度以保证尺寸与外观稳定。",
  },
  {
    category: "materials",
    title: "ABS 材料特点",
    content:
      "ABS（丙烯腈-丁二烯-苯乙烯）冲击强度好、易加工易喷涂、成本低，常用于外壳、汽车内饰和日用消费品，收缩率约 0.4-0.7%。",
  },
  {
    category: "materials",
    title: "PC 材料特点",
    content:
      "PC（聚碳酸酯）具有超高抗冲击、光学透明、耐高温的特点，常用于镜片与灯罩、安全设备和医疗器械，收缩率约 0.5-0.7%。",
  },
  {
    category: "materials",
    title: "PC/ABS 合金",
    content:
      "PC/ABS 合金兼具强度与成本的平衡、耐 UV 性好、加工窗口宽，广泛用于电子外壳、汽车装饰件和电动工具机身。",
  },
  {
    category: "materials",
    title: "PA6 / PA66 尼龙",
    content:
      "PA6/PA66 韧性优异、耐化学与耐磨，玻纤增强牌号强度更高，常用于齿轮、卡扣与紧固件等机舱内零件，收缩率 0.7-1.8%。",
  },
  {
    category: "materials",
    title: "PP 聚丙烯",
    content:
      "PP 质轻、耐化学、成本极低，常用于包装、汽车内饰和家居用品，收缩率较高（1.0-2.5%），设计时需重点考虑。",
  },
  {
    category: "materials",
    title: "POM 赛钢",
    content:
      "POM（聚甲醛）低摩擦、尺寸稳定性高、耐磨优异，常用于齿轮、精密轴承和链轮，收缩率 1.5-2.2%。",
  },
  {
    category: "materials",
    title: "TPU 热塑性聚氨酯",
    content:
      "TPU 具有弹性体柔性、耐磨优异、可包胶的特性，用于软触感握把、保护套和密封件，收缩率 0.6-1.5%。",
  },
  {
    category: "materials",
    title: "PEEK 聚醚醚酮",
    content:
      "PEEK 具超高温、耐化学与耐磨特性，价格昂贵，用于航空航天、医疗植入物和密封环等高性能场合，收缩率 0.5-1.0%。",
  },
  {
    category: "materials",
    title: "PMMA 亚克力",
    content:
      "PMMA 透明度极佳、耐 UV、耐刮擦，用于镜片、导光件和标牌，收缩率 0.3-0.6%，是高透光零件的常用材料。",
  },
  {
    category: "materials",
    title: "PBT 聚酯",
    content:
      "PBT 耐高温与电性能好、尺寸稳定、低蠕变，常用于连接器、线圈骨架和汽车电子，收缩率 0.8-2.0%。",
  },
  {
    category: "materials",
    title: "LSR 液态硅胶",
    content:
      "我们支持 LSR（液态硅胶）包胶与成型，用于医疗密封应用、按键和需要卫生与弹性的部件，可配合双色工艺。",
  },
  {
    category: "materials",
    title: "玻纤增强材料",
    content:
      "对于需要高强度的结构件，可使用 PA6-GF30、PA66-GF 等玻纤增强材料，但需注意其磨蚀性，模具宜采用淬硬钢（如 S136）以延长寿命。",
  },
  {
    category: "materials",
    title: "导电与阻燃材料",
    content:
      "电子行业常用 UL94 V-0 阻燃等级材料及满足 RoHS / REACH 要求的材料，我们可按客户指定牌号进行采购与试模。",
  },
  {
    category: "materials",
    title: "材料生物相容性",
    content:
      "医疗模具支持生物相容性材料（如 PPSU、PEEK、PC）的加工，按对标 ISO 13485 的标准管理，并提供相关验证文档。",
  },
  {
    category: "pricing",
    title: "模具价格区间",
    content:
      "对中等尺寸零件（约 200x150x100 mm）：单腔 5-10 万元，4 腔 10-20 万元，8 腔带热流道 20-40 万元。试制模具 2 万元起。精确价格需要图纸才能确定。",
  },
  {
    category: "pricing",
    title: "影响模具价格的因素",
    content:
      "模具价格主要由腔数、零件复杂程度、模具钢等级、公差要求、模具寿命目标和模具厂资历决定。其中腔数与钢材等级对价格影响最大。",
  },
  {
    category: "pricing",
    title: "腔数与成本关系",
    content:
      "增加腔数并非线性增加成本：从 1 腔到 8 腔通常成本乘以 2.5-3 倍而非 8 倍，因为固定设计与加工成本被分摊。年需求量越大，多腔越划算。",
  },
  {
    category: "pricing",
    title: "如何获取准确报价",
    content:
      "要获得准确报价，请提供三维模型（优先 STEP/STP）、带公差的 2D 图纸、目标年需求量、树脂材料、目标模具寿命以及收货地址。交期目标和年需求量是对价格影响最大的两个因素。",
  },
  {
    category: "pricing",
    title: "热流道对价格的影响",
    content:
      "热流道系统（尤其 8 腔以上）会增加模具成本，但同时缩短周期、减少料柄浪费。是否需要热流道取决于年产量与材料成本。",
  },
  {
    category: "pricing",
    title: "模具钢材与成本",
    content:
      "S136 淬硬钢相比 718H 通常溢价 30-50%，但寿命可达 300 万次且耐腐蚀树脂。为用不上的硬度多花钱并不划算，建议按产量选钢。",
  },
  {
    category: "pricing",
    title: "试制模具价格",
    content:
      "简单的试制/原型模具约 2 万元起，最快 3-4 周交付，适合在产品开发和小批量阶段验证设计与功能，之后再投资量产模具。",
  },
  {
    category: "pricing",
    title: "报价时效",
    content:
      "我们通常在收到完整图纸资料后 1-2 个工作日内给出初步模具报价，复杂项目会先进行 DFM 评审后再正式报价。",
  },
  {
    category: "pricing",
    title: "模具与生产总成本",
    content:
      "除了模具本身，还需考虑注塑件单价、材料费、模具维护和分摊的模具成本。多腔与热流道能降低单件成本，适合大批量订购。",
  },
  {
    category: "shipping",
    title: "运输与物流",
    content:
      "模具通过海运（FOB 深圳）或空运发出。我们采用规范的出口包装，并在需要时提供检测证书。",
  },
  {
    category: "shipping",
    title: "出口包装",
    content:
      "所有模具均采用规范的出口包装（防锈、防潮、加固木箱），按国际运输标准固定，确保长途运输后模具状态完好。",
  },
  {
    category: "shipping",
    title: "贸易术语",
    content:
      "模具常规按 FOB 深圳出货，也可根据客户要求采用 CIF、DDP 等其他贸易条款，配合客户指定的货代与物流方案。",
  },
  {
    category: "shipping",
    title: "整机与生产代工发货",
    content:
      "若您选择模具加生产的全套采购，注塑件可按约定批量交付，可配合您的装配计划制定发货节奏。",
  },
  {
    category: "shipping",
    title: "清关与文件",
    content:
      "出口时我们提供发票、装箱单和有关文件，并可按需提供检测报告与产地证明，配合海外清关流程。",
  },
  {
    category: "support",
    title: "售后支持",
    content:
      "我们对制造缺陷提供 12 个月模具保修、模具制造期间免费的设计评审以及终身技术支持。可按需提供备用镶件和维护指南。",
  },
  {
    category: "support",
    title: "模具保修范围",
    content:
      "模具因制造缺陷导致的问题在 12 个月保修期内免费维修。保修不含因改变设计、错误操作或超范围使用造成的损坏。",
  },
  {
    category: "support",
    title: "备用镶件",
    content:
      "我们可按需提供备用镶件（易损件、活动镶件），让客户在量产中遇到镶件损耗时能快速更换，减少停机。",
  },
  {
    category: "support",
    title: "维护指南",
    content:
      "随模具提供维护指南，涵盖日常清洁、防锈、润滑、模具存放和周期保养建议，帮助客户延长模具寿命。",
  },
  {
    category: "support",
    title: "技术支持与咨询",
    content:
      "我们提供终身技术支持，包括注塑参数建议、常见缺陷（缩痕、飞边、翘曲）排查，以及后续改模、复制模的咨询。",
  },
  {
    category: "support",
    title: "模具修改与升级",
    content:
      "支持对现有模具进行改胶口、改镶件、增加型腔或调整顶出等修改升级，让模具适应产品迭代或产量提升。",
  },
  {
    category: "support",
    title: "复制模",
    content:
      "当产能需要扩充时，我们可按原模具复制新模，保证型腔一致性与互换性，适合多供应商排产的情况。",
  },
  {
    category: "support",
    title: "能否连生产一起做",
    content:
      "可以。除了模具制造，我们还提供注塑代工服务，拥有 22 台 80-1,500 吨注塑机，您可以在一家完成模具加生产的全套采购。",
  },
  {
    category: "support",
    title: "模具维护周期建议",
    content:
      "量产模具建议每生产一定模次后进行例行保养（清洁、检查滑块与顶出、加润滑油），寿命期内按计划保养可显著降低突发故障。",
  },
  {
    category: "support",
    title: "培训与操作指导",
    content:
      "可配合客户需求提供模具上机、安装与调试的操作指导，帮助客户产线快速稳定投产。",
  },
  {
    category: "general",
    title: "我们能帮您做什么",
    content:
      "我们是一家注塑模具制造商，同时提供注塑代工。无论您需要试制模具、量产模具、双色/气辅/叠层等特种模具，还是模具加生产的全套服务，我们都可以承接。",
  },
  {
    category: "general",
    title: "如何开始合作",
    content:
      "合作流程：提交图纸与需求 → 我们进行 DFM 评审与报价 → 确认下单 → 模具设计 → 制造加工 → 试模 → 金样确认 → 出货。全程有项目经理跟进。",
  },
  {
    category: "general",
    title: "是否需要最低起订量",
    content:
      "我们既支持单套试制模具，也支持模具加注塑代工的量产订单。起订量可灵活协商，优先满足客户项目需求。",
  },
  {
    category: "general",
    title: "项目保密",
    content:
      "我们尊重客户知识产权，可按需签署保密协议（NDA），对图纸、材料配方和产品信息严格保密。",
  },
  {
    category: "general",
    title: "在与量产一致的设备上试模",
    content:
      "试模在同规格的注塑机（80-1,500 吨）上进行，确保样板与量产状态一致，避免因换机台导致的工艺差异。",
  },
  {
    category: "general",
    title: "汽车行业服务",
    content:
      "按 IATF 16949 体系制造汽车模具，配套 PPAP、IMDS 提交和 APQP 项目管理，制造保险杠、内饰件、连接器和机舱内零件。",
  },
  {
    category: "general",
    title: "医疗行业服务",
    content:
      "医疗模具经尺寸控制验证，可洁净室注塑。符合对标 ISO 13485 的要求，支持生物相容材料，并提供验证文档。典型为注射器组件、诊断卡壳等。",
  },
  {
    category: "general",
    title: "消费电子行业服务",
    content:
      "面向连接器、外壳和穿戴设备的精密高腔数模具，具备严格公差与低至 0.4mm 薄壁成型和外观翘曲控制能力。",
  },
  {
    category: "general",
    title: "包装行业服务",
    content:
      "面向高腔数系统优化的包装模具，如多腔瓶盖、薄壁容器和防拆封盖模具，均配备平衡式热流道歧管，优化注塑周期。",
  },
  {
    category: "general",
    title: "电动工具行业服务",
    content:
      "按抗冲击与耐 UV 设计的电动工具、齿轮和户外设备模具，支持双色软胶握把和橡胶包胶，符合 UL 60745 相关要求。",
  },
  {
    category: "general",
    title: "注塑代工能力",
    content:
      "我们拥有 22 台 80-1,500 吨注塑机用于试模与量产，可将模具制造与注塑生产整合在一家完成，省去多头对接的麻烦。",
  },
  {
    category: "general",
    title: "外观件与纹面",
    content:
      "可制作 SPI B1 等汽车内饰外观面及 VDI 模内纹面，让零件获得均匀的哑光或指定纹理外观，提升质感。",
  },
  {
    category: "general",
    title: "光学与透明件",
    content:
      "使用 PMMA、PC 等透明材料并采用 SPI A 类高光洁度型腔，可制作导光件、镜片罩等透明或光学外观件。",
  },
  {
    category: "general",
    title: "多行业多领域能力",
    content:
      "我们覆盖汽车、医疗、消费电子、包装和电动工具五个核心行业，积累了广泛的行业标准（IATF、ISO 13485、UL、FDA）与材料经验。",
  },
  {
    category: "general",
    title: "项目管理与沟通",
    content:
      "每个项目有专属项目经理，提供定期进度更新、试模报告和关键节点确认，确保信息透明、交期可控。",
  },
  {
    category: "general",
    title: "可持续与环保认证",
    content:
      "公司通过 ISO 14001 环境管理体系认证，注重节能减排与废弃物管理，支持客户对绿色供应链的要求。",
  },
  {
    category: "support",
    title: "多语言沟通",
    content:
      "我们提供中英文项目沟通，销售与技术团队能够用英文与全球客户顺畅对接图纸、技术规范和交期细节，降低沟通成本。",
  },
];
