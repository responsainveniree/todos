import { z } from "zod";

export const emailCredentialsSchema = z.object({
  email: z.email().trim(),
  password: z.string().trim().min(8),
});

export type EmailCredentialsSchema = z.infer<typeof emailCredentialsSchema>;
