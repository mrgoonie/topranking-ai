import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const blogRouter = createTRPCRouter({
	getAll: publicProcedure
		.input(
			z.object({
				filter: z.object({ tags: z.array(z.string()).optional() }).optional(),
				pagination: z
					.object({
						page: z.number(),
						itemPerPage: z.number(),
					})
					.optional(),
			})
		)
		.query(async ({ input, ctx }) => {
			const skip = input.pagination ? input.pagination?.itemPerPage * (input.pagination?.page - 1) : undefined;
			const take = input.pagination ? input.pagination?.itemPerPage : undefined;
			const data = await ctx.prisma.blog.findMany({
				where: { tags: { hasEvery: input.filter?.tags || [] } },
				orderBy: [{ createdAt: "desc" }, { updatedAt: "desc" }],
				skip,
				take,
			});
			return data;
		}),
	getBySlug: publicProcedure.input(z.string()).query(({ input, ctx }) => {
		return ctx.prisma.blog.findFirst({ where: { slug: input } });
	}),
});
