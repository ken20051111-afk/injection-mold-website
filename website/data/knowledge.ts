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
    category: "quote",
    title: "如何询价",
    content:
      "要获得准确报价，请提供三维模型（优先 STEP/STP）、带公差的 2D 图纸、目标年需求量、树脂材料、目标模具寿命以及收货地址。交期目标和年需求量是对价格影响最大的两个因素。",
  },
  {
    category: "quote",
    title: "模具价格区间",
    content:
      "对中等尺寸零件（约 200x150x100 mm）：单腔 5-10 万元，4 腔 10-20 万元，8 腔带热流道 20-40 万元。试制模具 2 万元起。精确价格需要图纸才能确定。",
  },
  {
    category: "quote",
    title: "付款方式",
    content:
      "标准付款方式为：下订单付 50% 定金，发货前付 50%。接受电汇付款。首次合作的客户可申请里程碑付款：下单付 40%、试模确认付 40%、发货前付 20%。",
  },
  {
    category: "quote",
    title: "运输与物流",
    content:
      "模具通过海运（FOB 深圳）或空运发出。我们采用规范的出口包装，并在需要时提供检测证书。",
  },
  {
    category: "support",
    title: "售后支持",
    content:
      "我们对制造缺陷提供 12 个月模具保修、模具制造期间免费的设计评审以及终身技术支持。可按需提供备用镶件和维护指南。",
  },
  {
    category: "support",
    title: "能否连生产一起做",
    content:
      "可以。除了模具制造，我们还提供注塑代工服务，拥有 22 台 80-1,500 吨注塑机，您可以在一家完成模具加生产的全套采购。",
  },
];
