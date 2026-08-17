import { cache } from "react";
import { listCapabilities, listIndustries } from "./content";

export type NavChild = { label: string; href: string };
export type NavItem = { label: string; href: string; children?: NavChild[] };

export const getNav = cache(async (): Promise<NavItem[]> => {
  const [caps, inds] = await Promise.all([listCapabilities(), listIndustries()]);
  return [
    {
      label: "加工能力",
      href: "/capabilities",
      children: caps.map((c) => ({ label: c.name, href: `/capabilities/${c.slug}` })),
    },
    {
      label: "服务行业",
      href: "/industries",
      children: inds.map((i) => ({ label: i.name, href: `/industries/${i.slug}` })),
    },
    { label: "工艺流程", href: "/process" },
    {
      label: "技术资源",
      href: "/resources",
      children: [
        { label: "行业博客", href: "/resources/blog" },
        { label: "模具报价指南", href: "/resources/quoting-guide" },
      ],
    },
    { label: "成功案例", href: "/case-studies" },
    { label: "常见问题", href: "/faq" },
    { label: "关于我们", href: "/about" },
    { label: "联系我们", href: "/contact" },
  ];
});
