import Link from "next/link";
import type { ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

type ButtonProps = {
  href?: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "dark";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
};

export function Button({ href, children, variant = "primary", size = "md", className = "", type = "button", onClick, disabled }: ButtonProps) {
  const base = "inline-flex items-center justify-center font-semibold tracking-wide transition-colors";
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };
  const variants = {
    primary: "bg-accent-500 text-white hover:bg-accent-600",
    secondary: "bg-white text-steel-900 border border-steel-600/20 hover:border-accent-500 hover:text-accent-500",
    ghost: "text-steel-900 hover:text-accent-500",
    dark: "bg-steel-900 text-white hover:bg-steel-800",
  };
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${disabled ? "opacity-50 pointer-events-none" : ""} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}

export function Badge({ children, tone = "accent" }: { children: ReactNode; tone?: "accent" | "steel" | "green" }) {
  const tones = {
    accent: "bg-accent-500/10 text-accent-500 border-accent-500/30",
    steel: "bg-steel-900/5 text-steel-700 border-steel-900/15",
    green: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-sm border px-2.5 py-1 text-xs font-semibold uppercase tracking-wider ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`mb-10 max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow ? <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent-500">{eyebrow}</p> : null}
      <h2 className="text-2xl font-bold text-steel-900 sm:text-3xl lg:text-4xl">{title}</h2>
      {description ? <p className="mt-4 text-base leading-relaxed text-slate-600">{description}</p> : null}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-lg border border-slate-200 bg-white shadow-sm ${className}`}>{children}</div>;
}

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="面包屑导航" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 ? <span aria-hidden className="text-slate-300">/</span> : null}
            {item.href ? (
              <Link href={item.href} className="hover:text-accent-500">
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-steel-900">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function SpecTable({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <table className="w-full text-left text-sm">
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-slate-100 last:border-0 odd:bg-slate-50/60">
              <th className="w-1/3 px-4 py-3 font-semibold text-steel-700">{row.label}</th>
              <td className="px-4 py-3 text-slate-600">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
