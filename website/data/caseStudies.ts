export type CaseStudy = {
  slug: string;
  title: string;
  industry: string;
  challenge: string;
  solution: string;
  results: { label: string; value: string }[];
  moldSpecs: { label: string; value: string }[];
  heroImage?: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "automotive-dash-connector",
    title: "德国一级供应商 24 腔连接器模具",
    industry: "automotive",
    challenge:
      "一家德国一级供应商需要一副 24 腔连接器外壳模具，跨腔间距精度 ±0.01mm，6 周内交付以赶上整车项目 SOP。",
    solution:
      "单元式型腔结构配合淬硬 S136 镶件、阀针式热流道和随形冷却。全套 PPAP Level 3 文件、逐腔 CMM 报告，4.5 周完成金样确认。",
    results: [
      { label: "交期", value: "4.5 周，行业平均 8 周" },
      { label: "型腔精度", value: "实现 ±0.008 mm" },
      { label: "模具寿命", value: "保 200 万次" },
      { label: "一次合格率", value: "98.6%" },
    ],
    moldSpecs: [
      { label: "腔数", value: "24" },
      { label: "模具钢", value: "S136 淬硬" },
      { label: "浇注系统", value: "阀针式热流道" },
      { label: "模具尺寸", value: "850 x 650 x 620 mm" },
    ],
  },
  {
    slug: "medical-luer-syringe",
    title: "医疗鲁尔组件，3.2 秒注塑周期",
    industry: "medical",
    challenge:
      "一家医疗 OEM 需要鲁尔锁组件模具，要求零毛刺、洁净室兼容注塑，并相对现有模具缩短 30% 周期。",
    solution:
      "32 腔高精密模具，配自定心锁紧、淬硬封胶镶件和平衡式歧管。周期开发在保持保压性能的前提下压缩了壁厚。",
    results: [
      { label: "注塑周期", value: "3.2 秒（缩短 30%）" },
      { label: "毛刺", value: "无，目检通过" },
      { label: "尺寸能力", value: "CPK > 1.67" },
      { label: "材料损耗", value: "-18%" },
    ],
    moldSpecs: [
      { label: "腔数", value: "32" },
      { label: "模具钢", value: "S136 + H13 封胶件" },
      { label: "周期", value: "3.2 秒" },
      { label: "洁净室", value: "ISO 7 兼容" },
    ],
  },
  {
    slug: "two-shot-power-tool-grip",
    title: "电动工具品牌双色软胶外壳",
    industry: "power-tools",
    challenge:
      "一家电动工具制造商需要一副双色电钻外壳模具，软胶 TPE 握把在 10 万次冲击测试后不得分层。",
    solution:
      "转盘式双色模具，PP/TPE 材料对匹配。T 型剥离结合验证 + 握把区域模内机械扣合，彻底消除分层风险。",
    results: [
      { label: "冲击测试", value: "通过 10 万次" },
      { label: "结合强度", value: "T-peel > 15 N/mm" },
      { label: "外观", value: "零溢线" },
      { label: "模具寿命", value: "150 万次" },
    ],
    moldSpecs: [
      { label: "工艺", value: "双色转盘" },
      { label: "材料", value: "PP + TPE" },
      { label: "腔数", value: "2 + 2" },
      { label: "模具尺寸", value: "1,050 x 900 x 780 mm" },
    ],
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
