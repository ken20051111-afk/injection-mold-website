import { buildMetadata } from "@/lib/seo";
import { Container, SectionHeading } from "@/components/ui";
import { QuoteForm } from "@/components/quote/QuoteForm";

export async function generateMetadata() {
  return buildMetadata({
    title: "Request a Mold Quote",
    description:
      "Get a DFM review and mold cost estimate within 24 hours. Send your part requirements and our engineers will respond with a proposal.",
    path: "/quote",
  });
}

export default function QuotePage() {
  return (
    <Container className="py-14">
      <div className="grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <SectionHeading
            eyebrow="RFQ"
            title="Request a Mold Quote"
            description="Free DFM review. Engineering response within 24 hours, formal quote within 2 business days."
          />
          <ul className="mt-6 space-y-4">
            {[
              ["24-hour engineering response", "DFM feedback before any commitment"],
              ["CMM-verified quality", "Dimensional reports with every mold"],
              ["Price-match confidence", "Transparent spec sheet, apples-to-apples quotes"],
              ["12-month warranty", "Free design reviews, lifetime support"],
            ].map(([title, desc]) => (
              <li key={title} className="flex gap-3">
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-500 text-xs text-white">&#10003;</span>
                <div>
                  <p className="font-semibold text-steel-900">{title}</p>
                  <p className="text-sm text-slate-500">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-bold uppercase tracking-widest text-slate-400">What happens next</p>
            <ol className="mt-3 space-y-2 text-sm text-slate-600">
              <li>1. Engineer reviews your requirements (24h)</li>
              <li>2. DFM feedback and cost estimate</li>
              <li>3. Formal quote with mold life & lead time</li>
              <li>4. Gold sample approval before shipping</li>
            </ol>
          </div>
        </div>
        <div className="lg:col-span-3">
          <QuoteForm />
        </div>
      </div>
    </Container>
  );
}
