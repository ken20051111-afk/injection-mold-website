export type Industry = {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  typicalParts: string[];
  standards: string[];
  materials: string[];
  keyword: string;
};

export const industries: Industry[] = [
  {
    slug: "automotive",
    name: "汽车行业",
    shortDescription:
      "IATF 16949 认证，面向内饰、外饰及机舱内塑料件制造模具。",
    description:
      "按 IATF 16949 体系制造汽车模具，配套 PPAP 文件、IMDS 提交和 APQP 项目管理。我们制造保险杠、内饰件、装饰框、连接器和机舱内零件，全程可追溯。",
    typicalParts: ["仪表板组件", "门板", "保险杠外罩", "连接器外壳", "机舱内零件"],
    standards: ["IATF 16949", "PPAP Level 3", "IMDS", "VDA 6.3"],
    materials: ["PP+EPDM", "ABS/ASA", "PC/ABS", "PA6-GF30", "POM"],
    keyword: "汽车塑料注塑模具供应商",
  },
  {
    slug: "medical",
    name: "医疗与健康",
    shortDescription:
      "洁净室兼容的模具，用于一次性耗材、诊断与给药器械。",
    description:
      "医疗模具经过可重复的尺寸控制验证，可在洁净室环境下注塑。我们符合 ISO 13485 质量要求、支持生物相容性材料加工并提供完整的验证文档。",
    typicalParts: ["注射器组件", "静脉穿刺接头", "诊断卡壳", "吸入器主体", "手术器械"],
    standards: ["对标 ISO 13485", "符合 21 CFR 材料", "模具验收报告"],
    materials: ["PC", "PP", "ABS", "POM", "PEEK", "PPSU"],
    keyword: "医疗塑料注塑模具制造商",
  },
  {
    slug: "electronics",
    name: "消费电子",
    shortDescription:
      "高精密、高腔数模具，用于连接器、外壳和穿戴设备组件。",
    description:
      "精密电子模具具备严格公差的浇注系统、低至 0.4mm 的薄壁成型能力以及外观面翘曲控制。我们为智能手机、可穿戴设备、物联网和家用电器生产模具。",
    typicalParts: ["连接器主体", "设备外壳", "穿戴设备框架", "镜片支架", "按键组件"],
    standards: ["UL94 V-0 阻燃", "符合 RoHS / REACH 材料"],
    materials: ["PC", "PC/ABS", "PA9T", "LCP", "PBT"],
    keyword: "电子注塑模具制造商",
  },
  {
    slug: "packaging",
    name: "包装行业",
    shortDescription:
      "高速多腔模具，用于瓶盖、盖类及薄壁容器。",
    description:
      "面向高腔数系统优化注塑周期的包装模具。多腔瓶盖模具、薄壁容器模具和防拆封盖模具，均配备平衡式热流道歧管。",
    typicalParts: ["瓶盖", "防拆封盖", "薄壁杯", "食品容器", "泵头与喷雾器"],
    standards: ["FDA 食品接触材料", "高腔平衡报告"],
    materials: ["PP", "HDPE", "PET", "PC"],
    keyword: "塑料包装模具制造商",
  },
  {
    slug: "power-tools",
    name: "电动工具与户外",
    shortDescription:
      "面向抗冲击与耐 UV 的耐用模具，用于工具外壳、齿轮和户外设备。",
    description:
      "电动工具外壳、齿轮传动和户外设备模具，按抗冲击强度与长模具寿命设计。双色软胶握把和橡胶包胶在厂内完成。",
    typicalParts: ["电钻外壳", "齿轮箱外壳", "软胶握把", "草坪设备零件", "电池外壳"],
    standards: ["对标 UL 60745", "IPX 防水特征"],
    materials: ["ABS", "PA6-GF30", "POM", "PP", "TPE"],
    keyword: "电动工具塑料模具供应商",
  },
];

export function getIndustry(slug: string) {
  return industries.find((i) => i.slug === slug);
}
