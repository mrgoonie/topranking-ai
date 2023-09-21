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
				filter: z.any().optional(),
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
			const data = await ctx.prisma.productCategory.findMany({
				where: input.filter,
				orderBy: [{ createdAt: "desc" }, { updatedAt: "desc" }],
				skip,
				take,
			});
			return data;
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
				tags: z.array(z.string()),
				// title: z.string().optional(),
				intro: z.string(),
				desc: z.string(),
				content: z.string(),
				keywords: z.string().array(),
				categoryList: z.string().array().default([]),
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
