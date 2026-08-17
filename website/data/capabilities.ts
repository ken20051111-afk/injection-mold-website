export type Capability = {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  specs: { label: string; value: string }[];
  applications: string[];
  faqs: { question: string; answer: string }[];
  keyword: string;
};

export const capabilities: Capability[] = [
  {
    slug: "precision-molds",
    name: "精密模具",
    shortDescription:
      "5 轴 CNC 加工、CMM 三坐标检测的精密模具，满足 OEM 项目严苛公差要求。",
    description:
      "按航空航天级公差控制标准制造的精密注塑模具。我们的 5 轴 CNC 加工中心、自建慢走丝线切割与 CMM 三坐标检测，保证型腔精度稳定在 ±0.005mm。",
    specs: [
      { label: "最大模具尺寸", value: "2,500 x 1,800 x 1,200 mm" },
      { label: "最大模具重量", value: "25 吨" },
      { label: "加工公差", value: "+/-0.005 mm" },
      { label: "常用模具钢", value: "S136, 718H, NAK80, P20, H13, S7" },
      { label: "模具寿命", value: "50万 - 300万次" },
    ],
    applications: ["医疗器件零件", "连接器外壳", "齿轮及精密零件"],
    faqs: [
      {
        question: "精密注塑模具能达到的公差是多少？",
        answer:
          "关键特征部位的型腔尺寸公差可稳定控制在 ±0.005mm，装配前每一组模仁都用 CMM 三坐标全检。",
      },
      {
        question: "大批量精密模具推荐用什么模具钢？",
        answer:
          "100 万次以上的模具建议使用淬硬后的 S136 或 NAK80；试制到中批量阶段，718H 或 P20 的成本平衡更好。",
      },
    ],
    keyword: "精密注塑模具制造商",
  },
  {
    slug: "multi-cavity-molds",
    name: "多腔模具",
    shortDescription:
      "4-128 腔模具，搭配平衡式热流道系统，大批量生产时单件成本更低。",
    description:
      "多腔模具工程通过流动仿真、平衡式热流道布局和单元式型腔结构实现，无需拆整副模具即可更换单个型腔。特别适合瓶盖、瓶盖类及一次性耗材产品。",
    specs: [
      { label: "腔数", value: "4 - 128" },
      { label: "热流道", value: "Husky / YUDO / Mold-Masters / 自产" },
      { label: "浇口类型", value: "阀针、热、潜伏式" },
      { label: "模具寿命", value: "100万 - 500万次" },
      { label: "周期优化", value: "流动分析 + 随形冷却" },
    ],
    applications: ["瓶盖及瓶盖类包装", "包装耗材", "一次性医疗用品"],
    faqs: [
      {
        question: "你们做过最快的注塑周期是多少？",
        answer:
          "在一副 64 腔瓶盖模具上，通过随形冷却实现了 3.8 秒注塑周期，比最初设计缩短了 22%。",
      },
      {
        question: "你们做单元式结构的多腔模具吗？",
        answer:
          "做。单元式型腔结构可在数小时内单独更换损坏的型腔，无需返修整副模具，保障大批量生产的开机率。",
      },
    ],
    keyword: "多腔注塑模具制造商",
  },
  {
    slug: "two-shot-molding",
    name: "双色注塑",
    shortDescription:
      "多物料与包胶模具，用于软触感、防水密封及双色外观产品。",
    description:
      "在双射注塑机上配合转盘实现双色与包胶注塑。我们从材料结合强度与两射之间浇口设计入手，彻底避免分层脱胶。",
    specs: [
      { label: "机型", value: "120 - 700 吨双射注塑机" },
      { label: "材料组合", value: "TPE/TPU 包覆 PP/ABS/PC、LSR、PA 包 TPE" },
      { label: "结合强度", value: "每件 T 型剥离验证" },
      { label: "旋转/型芯后退", value: "两种均可支持" },
      { label: "模具寿命", value: "50万 - 200万次" },
    ],
    applications: ["软触感手柄", "防水手机密封件", "防滑工具外壳"],
    faqs: [
      {
        question: "双色注塑中哪些材料组合的结合比较可靠？",
        answer:
          "当材料对在极性和加工温度上匹配时，TPE 包覆 PP、ABS 或 PC 无需底涂即可牢固结合。我们会在首批样件上做 T 型剥离试验验证结合强度。",
      },
      {
        question: "你们做 LSR 双色注塑吗？",
        answer:
          "做。我们支持 LSR/热塑性双色注塑，包括用于医疗和密封应用的冷流道 LSR 系统。",
      },
    ],
    keyword: "双色注塑模具制造商",
  },
  {
    slug: "gas-assisted-molding",
    name: "气辅注塑",
    shortDescription:
      "大型零件结构筋与中空截面，减少缩痕、减重、减小翘曲变形。",
    description:
      "面向大型结构件的气辅注塑工艺。我们把气道与名义壁厚进行平衡设计，实现 25-45% 的掏空率，在提高刚性的同时降低材料成本。",
    specs: [
      { label: "最大零件尺寸", value: "1,500 mm" },
      { label: "掏空率", value: "25 - 45%" },
      { label: "气体类型", value: "高压氮气" },
      { label: "缩痕", value: "筋位与柱位消除缩痕" },
      { label: "周期收益", value: "冷却提速最高 20%" },
    ],
    applications: ["汽车内饰件", "电视边框", "大型手柄及外壳"],
    faqs: [
      {
        question: "气辅注塑能节省多少材料？",
        answer:
          "对常见的带筋外壳件，气辅注塑相比实心截面可节省 20-35% 材料，同时提高刚度并消除缩痕。",
      },
    ],
    keyword: "气辅注塑模具供应商",
  },
  {
    slug: "stack-molds",
    name: "叠层模具",
    shortDescription:
      "双面模具结构，不增加设备投资即可让每吨锁模力产出翻倍。",
    description:
      "面向薄壁包装和高产量零件的叠层模具，充分挖掘每吨锁模力的产出。叠层模具集成同步热流道浇注系统，保证两条分型面充填一致。",
    specs: [
      { label: "层数", value: "2 - 3 层" },
      { label: "产出提升", value: "每周期最高 2 倍" },
      { label: "锁模力", value: "650 - 1,500 吨" },
      { label: "典型零件", value: "薄壁容器、盖子" },
      { label: "模具寿命", value: "200万 - 500万次" },
    ],
    applications: ["薄壁食品容器", "盖子及瓶盖", "大批量一次性用品"],
    faqs: [
      {
        question: "叠层模具与多腔模具相比，什么时候更划算？",
        answer:
          "叠层模具可在现有注塑机上让产量翻倍。如果受锁模力和周期双重限制，在大批量生产下叠层模具通常 8-14 个月即可收回投资。",
      },
    ],
    keyword: "叠层模具制造商",
  },
];

export function getCapability(slug: string) {
  return capabilities.find((c) => c.slug === slug);
}
