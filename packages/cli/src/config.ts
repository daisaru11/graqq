import { z } from "zod";

const ScalarTypeSchema = z.string();
const ScalarsConfigSchema = z.record(ScalarTypeSchema);
export type ScalarsConfig = z.infer<typeof ScalarsConfigSchema>;

export const ConfigSchema = z.object({
  schema: z.string().optional(),
  out: z.string().optional(),
  scalars: ScalarsConfigSchema.optional(),
});
export type Config = z.infer<typeof ConfigSchema>;
