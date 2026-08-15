export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readMinutes: number;
  keyword: string;
  body: string[];
  faqs: { question: string; answer: string }[];
};

export const posts: Post[] = [
  {
    slug: "injection-mold-cost-guide",
    title: "How Much Does an Injection Mold Cost? A 2026 Buyer's Guide",
    excerpt:
      "Real cost ranges for prototype, low and high-volume injection molds, plus the six factors that move your quote by 3-10x.",
    category: "Quoting",
    readMinutes: 9,
    keyword: "injection mold cost",
    body: [
      "Mold price is the first question every buyer asks and the hardest to answer with a single number. A simple two-plate prototype mold can land around $3,000, while a fully hardened 128-cavity packaging mold runs above $150,000. The spread is not random - it tracks six controllable factors.",
      "1. Number of cavities. Every extra cavity adds steel, machining time and a larger hot runner manifold. Moving from 1 to 8 cavities typically multiplies mold cost by 2.5-3x, not 8x, because fixed costs are shared.",
      "2. Part complexity. Undercuts force slide or lifter mechanisms, deep ribs require more EDM, and thin walls demand tighter steel. Each mechanical feature in the part adds 3-8% to the tool.",
      "3. Steel grade. P20 (28-32 HRC) suits low volume. S136 hardened to 48-52 HRC can triple the steel cost but extends life to 3M shots and resists corrosive resins.",
      "4. Tolerances. Tightening critical dimensions from +/-0.05 mm to +/-0.005 mm adds CMM verification time and demands slower, more precise machining.",
      "5. Mold life target. A 1M-shot mold needs hardened inserts, more robust cooling and better surface finish than a 100k-shot prototype tool.",
      "6. Mold maker's track record. Cheap quotes usually hide thinner steel, simpler cooling and longer sampling. Compare on tool life and delivery, not price alone.",
      "A fast way to sanity-check a quote: for a mid-size part (200x150x100 mm) expect roughly $8,000-$15,000 for 1 cavity, $15,000-$30,000 for 4 cavities and $30,000-$60,000 for 8 cavities with hot runner.",
    ],
    faqs: [
      {
        question: "What is the average price of an injection mold in China?",
        answer:
          "For mid-size parts, a 1-cavity mold is typically $8,000-$15,000, 4-cavity $15,000-$30,000 and 8-cavity with hot runner $30,000-$60,000 from a mid-tier factory.",
      },
      {
        question: "Why is the mold cost so different between suppliers?",
        answer:
          "Differences come from cavity count, steel grade, tolerance, mold life target and the machined surface finish standard. Ask every supplier for the same specification sheet before comparing.",
      },
    ],
  },
  {
    slug: "dfm-tips-reduce-mold-cost",
    title: "7 DFM Rules That Cut Injection Mold Cost by 30%",
    excerpt:
      "Design for manufacturability decisions that remove slides, shorten cycles and shrink your tooling budget before it goes to quoting.",
    category: "Design",
    readMinutes: 7,
    keyword: "injection mold DFM",
    body: [
      "Most mold cost overruns are decided before the tooling buyer is even involved - in the CAD model. A few DFM rules pay back immediately at the quoting stage.",
      "1. Keep wall thickness uniform. Variation between 2.5 mm and 4 mm forces slower cooling and invites sink marks. Uniform walls reduce cycle and tool complexity.",
      "2. Avoid deep, narrow ribs. Rib depth beyond 4x wall thickness requires hardened inserts and longer EDM. Draft ribs 0.5-1.0 degrees minimum.",
      "3. Round internal corners. Sharp internal corners become stress risers and demand more machining passes. A 0.5R internal radius is a free cycle and tool-life win.",
      "4. Design out undercuts. One slide can add 8-12% to mold cost. Rotate the part, add a hole for a lifter or split the part line to eliminate slides.",
      "5. Specify realistic tolerances. Every +/-0.005 mm adds a CMM report and slower cutting. Only lock the tolerances that actually affect fit and function.",
      "6. Pick gate location early. Gate location dictates flow, weld lines and cosmetic surfaces. A wrong gate means mold rework - the most expensive DFM mistake.",
      "7. Send STEP + 2D drawings together. Complete geometry data lets the mold maker quote accurately the first time instead of padding for unknowns.",
    ],
    faqs: [
      {
        question: "What DFM issues increase injection mold cost the most?",
        answer:
          "Undercuts requiring slides, non-uniform wall thickness, deep ribs and over-specified tolerances. Fixing these in design typically saves 20-30% on tooling.",
      },
    ],
  },
  {
    slug: "steel-grade-selection",
    title: "Choosing Mold Steel: P20, 718H, NAK80 or S136?",
    excerpt:
      "A practical steel selection table matched to your volume, resin and surface finish - so you don't overpay for hardness you never use.",
    category: "Materials",
    readMinutes: 6,
    keyword: "injection mold steel grade",
    body: [
      "Mold steel is where tool life, polish quality and price meet. The right grade depends on four questions: volume, resin type, surface finish and whether the tool must run corrosive or glass-filled materials.",
      "P20 is the workhorse for prototypes and low volume (up to 250k shots). It is pre-hardened, machinable and cheap. Use it when time-to-sample matters more than longevity.",
      "718H (33-38 HRC) is the mid-volume standard. It holds polish better than P20 and is safe for 1M shots on non-abrasive resins like PP and ABS.",
      "NAK80 (38-42 HRC) takes a mirror finish, making it the choice for cosmetic surfaces in consumer electronics and automotive interior trim.",
      "S136 (48-52 HRC) hardened is for corrosive resins (PVC, flame-retardant compounds) and long-life tools up to 3M shots. The premium over 718H is usually 30-50%.",
      "H13 is reserved for hot surfaces - high-temperature resin contact, valve gate tips and cores that must survive thermal cycling.",
      "Rule of thumb: buy the softest steel that meets your volume and finish. Hardness you don't need is money you can't recover.",
    ],
    faqs: [
      {
        question: "Which steel grade is best for a 500,000 shot mold?",
        answer:
          "718H at 33-38 HRC is the cost-effective choice for 500k shots on standard resins. Upgrade to S136 if your resin is corrosive or glass-filled.",
      },
    ],
  },
  {
    slug: "lead-time-explained",
    title: "Injection Mold Lead Times: What's Realistic in 2026",
    excerpt:
      "A week-by-week breakdown of a standard mold program and what causes late deliveries - and how to protect your own schedule.",
    category: "Quoting",
    readMinutes: 5,
    keyword: "injection mold lead time",
    body: [
      "A typical injection mold program runs 4-8 weeks depending on size and complexity. Understanding where that time goes keeps your expectations honest and your program on schedule.",
      "Week 1: DFM review and finalization. The mold maker validates gating, draft, shrink and ejection. This gate is where engineering change requests must stop.",
      "Weeks 2-4: machining. Roughing, hardening, finishing and EDM run in parallel across the shop. Precision molds need 10-14 days of CNC plus 3-5 days of EDM.",
      "Weeks 4-6: fitting, polishing and assembly. Fitting typically consumes 5-8 days and is the quality bottleneck - rushed fitting shows up as flash and poor ejection.",
      "Weeks 6-8: sampling, trial and adjust. First shot to gold sample usually takes 5-10 trial days, more for optical or multi-cavity tools.",
      "What delays programs: late engineering changes (the #1 cause), incomplete 2D/3D data, and under-budgeted polishing on high-gloss tools. Deliver complete files and freeze the design before kickoff.",
    ],
    faqs: [
      {
        question: "How fast can a simple injection mold be delivered?",
        answer:
          "A simple prototype mold can be built in 3-4 weeks. Precision or multi-cavity molds realistically take 5-8 weeks including sampling.",
      },
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}
