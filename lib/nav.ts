import { cache } from "react";
import { listCapabilities, listIndustries } from "./content";

export type NavChild = { label: string; href: string };
export type NavItem = { label: string; href: string; children?: NavChild[] };

export const getNav = cache(async (): Promise<NavItem[]> => {
  const [caps, inds] = await Promise.all([listCapabilities(), listIndustries()]);
  return [
    {
      label: "Capabilities",
      href: "/capabilities",
      children: caps.map((c) => ({ label: c.name, href: `/capabilities/${c.slug}` })),
    },
    {
      label: "Industries",
      href: "/industries",
      children: inds.map((i) => ({ label: i.name, href: `/industries/${i.slug}` })),
    },
    { label: "Process", href: "/process" },
    {
      label: "Resources",
      href: "/resources",
      children: [
        { label: "Blog", href: "/resources/blog" },
        { label: "Mold Quoting Guide", href: "/resources/quoting-guide" },
      ],
    },
    { label: "Case Studies", href: "/case-studies" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];
});
