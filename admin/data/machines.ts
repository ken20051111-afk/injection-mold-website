export const machines = [
  { category: "CNC 加工", count: 18, detail: "Mazak 与 DMG MORI 五轴及三轴加工中心" },
  { category: "放电加工", count: 10, detail: "慢走丝与电火花成形（Charmilles、Sodick）" },
  { category: "磨削加工", count: 6, detail: "精密平面磨床与成形磨床" },
  { category: "注塑成型", count: 22, detail: "80 - 1,500 吨注塑机，用于试模与量产" },
  { category: "检测设备", count: 8, detail: "三坐标、光学测量、三维扫描仪" },
] as const;

export const productionLines = [
  { name: "精密模具车间", detail: "2,500 平方米防尘车间，7×24 小时运作" },
  { name: "试模产线", detail: "与量产一致的注塑机，用于 DOE 试模" },
  { name: "装配与配模", detail: "配扭矩与气密检测工位的清洁装配台" },
] as const;
