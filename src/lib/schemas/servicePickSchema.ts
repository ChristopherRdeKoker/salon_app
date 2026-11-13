import { z } from "zod";

export const servicePickSchema = z.object({
  serviceIds: z.array(z.string().min(1)).min(1, "Choose at least one service").max(6, "Choose up to six services per visit"),
});
