export const machines = [
  { category: "CNC Machining", count: 18, detail: "5-axis and 3-axis Mazak & DMG MORI machining centers" },
  { category: "EDM", count: 10, detail: "Wire-cut and sinker EDM (Charmilles, Sodick)" },
  { category: "Grinding", count: 6, detail: "Precision surface and profile grinders" },
  { category: "Injection Molding", count: 22, detail: "80 - 1,500 ton machines for sampling & production" },
  { category: "Inspection", count: 8, detail: "CMM, optical measuring, 3D scanners" },
] as const;

export const productionLines = [
  { name: "Precision Mold Shop", detail: "Dust-controlled 2,500 m2 workshop, 24/7 operation" },
  { name: "Sampling & Trial Line", detail: "Production-identical machines for DOE sampling" },
  { name: "Assembly & Fitting", detail: "Clean benches with torque and air-leak stations" },
] as const;
