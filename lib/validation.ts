import { z } from "zod";

export const quoteFormSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email"),
  company: z.string().min(1, "Please enter your company"),
  jobTitle: z.string().optional(),
  country: z.string().min(2, "Please select your country"),
  phone: z.string().optional(),
  projectName: z.string().optional(),
  materials: z.array(z.string()).min(1, "Select at least one material"),
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
    message: "Please accept the privacy policy",
  }),
});

export type QuoteFormValues = z.infer<typeof quoteFormSchema>;

export const chatSchema = z.object({
  conversationId: z.string().optional(),
  message: z.string().min(1).max(1000),
  email: z.string().email().optional(),
});

export const contactFormSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  company: z.string().min(1),
  country: z.string().optional(),
  message: z.string().min(10).max(3000),
  consent: z.boolean().refine((v) => v === true),
});
