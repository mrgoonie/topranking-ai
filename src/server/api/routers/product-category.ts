import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { makeSlug } from "@/plugins/utils/slug";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";

const productCategoryUpdateSchema = z.object({
	where: z.any().default({}),
	data: z.object({
		name: z.string().optional(),
		tags: z.array(z.string()),
		desc: z.string().optional(),
	}),
});

export const productCategoryRouter = createTRPCRouter({
	getAll: publicProcedure
		.input(
			z.object({
				filter: z.any().default({}),
				include: z.any().optional(),
				pagination: z
					.object({
						page: z.number(),
						itemPerPage: z.number(),
					})
					.optional(),
				offset: z.object({ skip: z.number().default(0), take: z.number() }).optional(),
				orderBy: z
					.object({
						createdAt: z.enum(["desc", "asc"]).optional(),
						updatedAt: z.enum(["desc", "asc"]).optional(),
						products: z.any().optional(),
					})
					.array()
					.default([{ createdAt: "desc" }, { updatedAt: "desc" }]),
			})
		)
		.query(async ({ input, ctx }) => {
			// validation
			if (input.offset && input.pagination) console.warn(`When "offset" is used, "pagination" will be skipped.`);

			// pagination
			const total_items = await ctx.prisma.productCategory.count({ where: input.filter });
			const skip =
				input.offset?.skip ??
				(input.pagination ? input.pagination?.itemPerPage * (input.pagination?.page - 1) : undefined);
			const take = input.offset?.take ?? (input.pagination ? input.pagination?.itemPerPage : undefined);
			const total_pages = typeof take !== "undefined" ? Math.ceil(total_items / take) : 0;

			// start querying
			const data = await ctx.prisma.productCategory.findMany({
				include: input.include,
				where: input.filter,
				orderBy: input.orderBy,
				skip,
				take,
			});
			// console.log("data :>> ", data);

			// response
			return {
				data,
				pagination: { ...input.pagination, total_items, total_pages },
			};
		}),
	getById: publicProcedure.input(z.string()).query(({ input, ctx }) => {
		return ctx.prisma.productCategory.findFirst({ where: { id: input } });
	}),
	getBySlug: publicProcedure.input(z.string()).query(({ input, ctx }) => {
		return ctx.prisma.productCategory.findFirst({ where: { slug: input } });
	}),
	create: protectedProcedure
		.input(
			z.object({
				name: z.string(),
				slug: z.string(),
			})
		)
		.mutation(async ({ input, ctx }) => {
			const slug = makeSlug(input.name);

			return ctx.prisma.productCategory.create({
				data: {
					...input,
					slug,
				},
			});
		}),
	updateOne: protectedProcedure.input(productCategoryUpdateSchema).mutation(async ({ input, ctx }) => {
		const slug = input.data.name ? makeSlug(input.data.name) : undefined;

		// existing one
		const currentProductCat = await ctx.prisma.productCategory.findFirst({ where: input.where });
		if (!currentProductCat)
			throw new TRPCError({ code: "NOT_FOUND", message: `Unable to update, product category not found.` });

		return ctx.prisma.productCategory.update({
			where: input.where,
			data: {
				...input,
				slug,
			},
		});
	}),
});
