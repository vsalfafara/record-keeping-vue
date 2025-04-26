import { z } from "zod";

const EnvSchema = z.object({
  VITE_API: z.string(),
});

export type Environment = z.infer<typeof EnvSchema>;

export function useEnv() {
  const { data: env, error } = EnvSchema.safeParse(import.meta.env);

  if (error) {
    const errorMessage = `Invalid env: ${Object.entries(
      error.flatten().fieldErrors
    )
      .map(([key, errors]) => `${key}: ${errors.join(",")}`)
      .join(" | ")}`;
    throw new Error(errorMessage);
  }
  return { env };
}
