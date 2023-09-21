import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { classifyKeywords } from "@/plugins/ask-ai/classify-keywords";
import { crawlWebpage } from "@/plugins/crawler/crawl-webpage";
import { makeSlug } from "@/plugins/utils/slug";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";

export const getOrInsertCategories = async (categoryList: string[], prisma: PrismaClient) => {
	const categoryIds = await Promise.all(
		categoryList.map(async (catName) => {
			const catSlug = makeSlug(catName);

			const existingCategory = await prisma.productCategory.findFirst({ where: { slug: catSlug } });
			if (existingCategory) return existingCategory.id;

			const category = await prisma.productCategory.create({
				data: { name: catName, slug: catSlug },
			});
			return category.id;
		})
	);
	return categoryIds;
};

const productUpdateSchema = z.object({
	where: z.any().default({}),
	data: z.object({
		name: z.string().optional(),
		tags: z.array(z.string()),
		// title: z.string().optional(),
		intro: z.string().optional(),
		desc: z.string().optional(),
		content: z.string().optional(),
		keywords: z.string().array().default([]),
		categoryList: z.string().array().default([]),
	}),
});

export const productRouter = createTRPCRouter({
	getAll: publicProcedure
		.input(
			z.object({
				filter: z
					.object({
						tags: z.array(z.string()).optional(),
					})
					.optional(),
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
			const data = await ctx.prisma.product.findMany({
				where: { tags: { hasEvery: input.filter?.tags || [] } },
				orderBy: [{ createdAt: "desc" }, { updatedAt: "desc" }],
				skip,
				take,
			});
			return data;
		}),
	getById: publicProcedure.input(z.string()).query(({ input, ctx }) => {
		return ctx.prisma.product.findFirst({ where: { id: input } });
	}),
	getBySlug: publicProcedure.input(z.string()).query(({ input, ctx }) => {
		return ctx.prisma.product.findFirst({ where: { slug: input } });
	}),
	create: protectedProcedure
		.input(
			z.object({
				url: z.string(),
				name: z.string().optional(),
				tags: z.array(z.string()),
				title: z.string().optional(),
				intro: z.string(),
				desc: z.string(),
				content: z.string(),
				keywords: z.string().array(),
				categoryList: z.string().array().default([]),
			})
		)
		.mutation(async ({ input, ctx }) => {
			const { user } = ctx.session;

			const urlStr = input.url.replace(/www./i, "");
			const siteUrl = new URL(`https://${urlStr}`); // 'https://www.google.com/?abc=123&xyz=123'
			const url = siteUrl.host; // www.google.com
			const name = input.name || makeSlug(urlStr);
			const slug = makeSlug(input.url);
			const contentNoUnicode = makeSlug(input.content, { delimiter: " " });

			// check duplication
			const countExisting = await ctx.prisma.product.count({ where: { slug } });
			if (countExisting > 0)
				throw new TRPCError({ code: "BAD_REQUEST", message: `Unable to create: Product is existed.` });

			// categories
			const categoryIds = await getOrInsertCategories(input.categoryList, ctx.prisma);
			const newProduct = await ctx.prisma.product.create({
				data: {
					...input,
					url,
					name,
					slug,
					ownerId: user.id,
					contentNoUnicode,
					categoryIds,
				},
			});

			// TODO: process URL analysis...
			crawlWebpage(input.url, {
				isDebugging: true,
				removeHtml: true,
				removeJsCss: true,
				removeSpaceTab: true,
			})
				.then(async ({ title, content: pageContent }) => {
					console.log("[CREATE PRODUCT] Analyzed > title :>> ", title);

					// ask AI to analyze this page content...
					const keywords = await classifyKeywords(pageContent);
					console.log("[CREATE PRODUCT] Analyzed > keywords :>> ", keywords);

					const updatedProduct = await ctx.prisma.product.update({
						where: { id: newProduct.id },
						data: { title, keywords },
					});
					console.log("[CREATE PRODUCT] Analyzed > updatedProduct :>> ", updatedProduct);
				})
				.catch((e: any) => {
					console.error(`[CREATE PRODUCT] Unable to crawl this web page: ${input.url} > ${e}`);
				});

			return newProduct;
		}),
	updateOne: protectedProcedure.input(productUpdateSchema).mutation(async ({ input, ctx }) => {
		const { user } = ctx.session;
		const slug = input.data.name ? makeSlug(input.data.name) : undefined;
		const contentNoUnicode = input.data.content ? makeSlug(input.data.content, { delimiter: " " }) : undefined;

		// existing one
		const currentProduct = await ctx.prisma.product.findFirst({ where: input.where });
		if (!currentProduct)
			throw new TRPCError({ code: "NOT_FOUND", message: `Unable to update, product not found.` });

		// categories
		const newCategoryIds = await getOrInsertCategories(input.data.categoryList, ctx.prisma);
		const categoryIds = [...currentProduct.categoryIds, ...newCategoryIds];

		return ctx.prisma.product.update({
			where: input.where,
			data: {
				...input,
				slug,
				updatedById: user.id,
				contentNoUnicode,
				categoryIds,
			},
		});
	}),
	/**
	 * upvote product
	 */
	upvote: protectedProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
		const { user } = ctx.session;

		// find product
		const product = await ctx.prisma.product.findFirst({ where: { id: input } });
		if (!product) throw new TRPCError({ code: "NOT_FOUND", message: `Unable to upvote, product not found.` });

		// if this user already voted -> throw error
		const isVoted = product.voterIds.includes(user.id);
		if (isVoted) throw new TRPCError({ code: "BAD_REQUEST", message: `Unable to upvote a product twice.` });

		const voteCount = product.voteCount + 1;
		const voterIds = [...product.voterIds, user.id];

		return ctx.prisma.product.update({ where: { id: input }, data: { voteCount, voterIds } });
	}),
});
