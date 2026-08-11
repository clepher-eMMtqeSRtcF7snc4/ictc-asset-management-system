import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();
const publicProcedure = t.procedure;

const appRouter = t.router({
  usersRouter: t.router({
    updateProfile: publicProcedure.input(z.object({
      name: z.string().trim().min(1, "This field is required").max(50, "Maximum 50 characters"),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getUserProfile: publicProcedure.input(z.object({
      userId: z.string(),
    })).output(z.object({
      id: z.string(),
      name: z.string(),
      image: z.string().nullable(),
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  })
});
export type AppRouter = typeof appRouter;

