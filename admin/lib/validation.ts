import { z } from "zod";

export const quoteFormSchema = z.object({
  fullName: z.string().min(2, "请输入您的姓名"),
  email: z.string().email("请输入有效的邮箱地址"),
  company: z.string().min(1, "请输入公司名称"),
  jobTitle: z.string().optional(),
  country: z.string().min(2, "请选择国家/地区"),
  phone: z.string().optional(),
  projectName: z.string().optional(),
  materials: z.array(z.string()).min(1, "请至少选择一种材料"),
  partDimensions: z.string().optional(),
  annualVolume: z.number().int().positive().optional(),
  cavityTarget: z.number().int().min(1).max(128).optional(),
  tolerance: z.string().optional(),
  surfaceFinish: z.string().optional(),
  targetMoldLife: z.string().optional(),
  deadline: z.string().optional(),
  targetPrice: z.number().positive().optional(),
  drawingsAvailable: z.boolean().default(false),
  details: z.string().max(2000).optional(),
  consent: z.boolean().refine((v) => v === true, {
    message: "请同意隐私政策",
  }),
});

export type QuoteFormValues = z.infer<typeof quoteFormSchema>;

export const chatSchema = z.object({
  conversationId: z.string().optional(),
  message: z.string().min(1).max(1000),
  email: z.string().email().optional(),
});

export const contactFormSchema = z.object({
  fullName: z.string().min(2, "请输入您的姓名"),
  email: z.string().email("请输入有效的邮箱地址"),
  company: z.string().min(1, "请输入公司名称"),
  country: z.string().optional(),
  message: z.string().min(10, "留言内容至少 10 个字").max(3000),
  consent: z.boolean().refine((v) => v === true, { message: "请同意隐私政策" }),
});
