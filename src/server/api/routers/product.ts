import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { askAi } from "@/plugins/ask-ai";
import { aiModels } from "@/plugins/ask-ai/ai-api";
import { classifyKeywords } from "@/plugins/ask-ai/classify-keywords";
import { crawlWebpage } from "@/plugins/crawler/crawl-webpage";
import { makeSlug } from "@/plugins/utils/slug";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";

import type { PrismaClient } from "../../../../prisma/prisma-client";

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
				orderBy: z
					.any()
					.array()
					.default([{ createdAt: "desc" }, { updatedAt: "desc" }]),
			})
		)
		.query(async ({ input, ctx }) => {
			const total_items = await ctx.prisma.product.count({
				where: { tags: { hasEvery: input.filter?.tags || [] } },
			});
			const skip = input.pagination ? input.pagination?.itemPerPage * (input.pagination?.page - 1) : undefined;
			const take = input.pagination ? input.pagination?.itemPerPage : undefined;
			const total_pages = typeof take !== "undefined" ? Math.ceil(total_items / take) : 0;

			const data = await ctx.prisma.product.findMany({
				where: { tags: { hasEvery: input.filter?.tags || [] } },
				orderBy: [],
				skip,
				take,
			});
			return { data, pagination: { ...input.pagination, total_items, total_pages } };
		}),
	getById: publicProcedure.input(z.string()).query(({ input, ctx }) => {
		return ctx.prisma.product.findFirst({ where: { id: input } });
	}),
	getBySlug: publicProcedure.input(z.string()).query(({ input, ctx }) => {
		return ctx.prisma.product.findFirst({ where: { slug: input } });
	}),
	crawl: publicProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
		const urlStr = input.replace(/www./i, "");
		const siteUrl = new URL(`https://${urlStr}`);

		const webpageData = await crawlWebpage(siteUrl.toString(), {
			isDebugging: true,
			removeHtml: true,
			removeJsCss: true,
			removeSpaceTab: true,
		});

		// use AI to summarize the website content
		console.log(`[CRAWL] Summarizing content...`);
		const summaryResult = await askAi(`Summarize this content:\n${webpageData.content}`, aiModels[1]);
		const summary = summaryResult.error ? "" : (summaryResult.content || [""]).join("");

		// use AI to classify keywords
		console.log(`[CRAWL] Classifying keywords...`);
		const keywords = await classifyKeywords(summary);

		const data: typeof webpageData & { summary: string; keywords: string[] } = {
			...webpageData,
			summary,
			keywords,
		};
		return data;
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
				imageUrl: z.string().optional(),
				images: z.string().array().default([]),
			})
		)
		.mutation(async ({ input, ctx }) => {
			const { user } = ctx.session;

			const urlStr = input.url.replace(/www./i, "");
			const siteUrl = new URL(`https://${urlStr}`); // 'https://www.google.com/?abc=123&xyz=123'
			const url = siteUrl.host; // www.google.com
			const name = input.name || makeSlug(urlStr);
			const slug = makeSlug(name);
			const contentNoUnicode = makeSlug(input.content, { delimiter: " " });

			// check duplication
			const countExisting = await ctx.prisma.product.count({ where: { slug } });
			if (countExisting > 0)
				throw new TRPCError({ code: "BAD_REQUEST", message: `Unable to create: Product is existed.` });

			// categories
			const categoryIds = await getOrInsertCategories(input.categoryList, ctx.prisma);

			const newProduct = await ctx.prisma.product.create({
				data: {
					url,
					name,
					slug,
					title: input.title,
					intro: input.intro,
					desc: input.desc,
					content: input.content,
					imageUrl: input.imageUrl,
					images: input.images,
					tags: input.tags,
					ownerId: user.id,
					contentNoUnicode,
					categoryIds,
				},
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
