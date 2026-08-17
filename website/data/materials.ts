export type Material = {
  name: string;
  shortName: string;
  properties: string[];
  applications: string[];
  costIndex: string;
  shrink: string;
};

export const materials: Material[] = [
  {
    name: "丙烯腈-丁二烯-苯乙烯",
    shortName: "ABS",
    properties: ["冲击强度好", "易加工、易喷涂", "成本低"],
    applications: ["外壳", "汽车内饰", "日用消费品"],
    costIndex: "$",
    shrink: "0.4-0.7%",
  },
  {
    name: "聚碳酸酯",
    shortName: "PC",
    properties: ["超高抗冲击", "光学透明", "耐高温"],
    applications: ["镜片与灯罩", "安全设备", "医疗器械"],
    costIndex: "$$",
    shrink: "0.5-0.7%",
  },
  {
    name: "聚碳酸酯/ABS 合金",
    shortName: "PC/ABS",
    properties: ["强度与成本均衡", "耐 UV 性好", "加工窗口宽"],
    applications: ["电子外壳", "汽车装饰件", "电动工具机身"],
    costIndex: "$$",
    shrink: "0.5-0.7%",
  },
  {
    name: "聚酰胺（尼龙）6 / 66",
    shortName: "PA6 / PA66",
    properties: ["韧性优异", "耐化学与耐磨", "玻纤增强牌号"],
    applications: ["齿轮", "卡扣与紧固件", "机舱内零件"],
    costIndex: "$$",
    shrink: "0.7-1.8%",
  },
  {
    name: "聚丙烯",
    shortName: "PP",
    properties: ["质轻", "耐化学", "成本极低"],
    applications: ["包装", "汽车内饰", "家居用品"],
    costIndex: "$",
    shrink: "1.0-2.5%",
  },
  {
    name: "聚甲醛（赛钢）",
    shortName: "POM",
    properties: ["低摩擦", "尺寸稳定性高", "耐磨优异"],
    applications: ["齿轮", "精密轴承", "链轮"],
    costIndex: "$$",
    shrink: "1.5-2.2%",
  },
  {
    name: "热塑性聚氨酯",
    shortName: "TPU",
    properties: ["弹性体柔性", "耐磨优异", "可包胶"],
    applications: ["软触感握把", "保护套", "密封件"],
    costIndex: "$$$",
    shrink: "0.6-1.5%",
  },
  {
    name: "聚醚醚酮",
    shortName: "PEEK",
    properties: ["超高温", "耐化学与耐磨", "价格昂贵"],
    applications: ["航空航天", "医疗植入物", "密封环"],
    costIndex: "$$$$",
    shrink: "0.5-1.0%",
  },
  {
    name: "聚甲基丙烯酸甲酯",
    shortName: "PMMA",
    properties: ["透明度极佳", "耐 UV", "耐刮擦"],
    applications: ["镜片", "导光件", "标牌"],
    costIndex: "$$",
    shrink: "0.3-0.6%",
  },
  {
    name: "聚对苯二甲酸丁二醇酯",
    shortName: "PBT",
    properties: ["耐高温与电性能好", "尺寸稳定", "低蠕变"],
    applications: ["连接器", "线圈骨架", "汽车电子"],
    costIndex: "$$",
    shrink: "0.8-2.0%",
  },
];

export const tolerances = [
  { feature: "关键尺寸", standard: "+/-0.01 mm", precision: "+/-0.005 mm" },
  { feature: "常规尺寸", standard: "+/-0.05 mm", precision: "+/-0.02 mm" },
  { feature: "壁厚", standard: "+/-0.03 mm", precision: "+/-0.01 mm" },
  { feature: "孔位", standard: "+/-0.05 mm", precision: "+/-0.015 mm" },
] as const;

export const surfaceFinishes = [
  { grade: "SPI A1", finish: "SPI-A1", roughness: "0.012-0.025 um Ra", use: "外观面、光学件" },
  { grade: "SPI A3", finish: "SPI-A3", roughness: "0.05-0.10 um Ra", use: "抛光外观件" },
  { grade: "SPI B1", finish: "SPI-B1", roughness: "0.10-0.15 um Ra", use: "汽车内饰" },
  { grade: "SPI C1", finish: "SPI-C1", roughness: "0.35-0.45 um Ra", use: "功能面" },
  { grade: "SPI D1", finish: "SPI-D1", roughness: "1.2-1.7 um Ra", use: "纹面、低光泽" },
  { grade: "VDI 27", finish: "VDI-27", roughness: "0.9-1.1 um Ra", use: "模内纹面" },
] as const;

export const steelGrades = [
  { grade: "P20", hardness: "28-32 HRC", use: "试制与小批量", life: "最高 25 万次" },
  { grade: "718H", hardness: "33-38 HRC", use: "中批量、预硬化", life: "最高 100 万次" },
  { grade: "NAK80", hardness: "38-42 HRC", use: "高抛光、镜面", life: "最高 150 万次" },
  { grade: "S136", hardness: "48-52 HRC", use: "腐蚀性树脂、长寿命", life: "100万 - 300万次" },
  { grade: "H13", hardness: "46-52 HRC", use: "高温面、高温树脂", life: "最高 200 万次" },
  { grade: "S7", hardness: "46-50 HRC", use: "高冲击模具", life: "最高 200 万次" },
] as const;
