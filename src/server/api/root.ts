import { blogRouter } from "@/server/api/routers/blog";
import { userRouter } from "@/server/api/routers/user";
import { createTRPCRouter } from "@/server/api/trpc";

import { imageRouter } from "./routers/image-router";
import { productRouter } from "./routers/product";
import { productCategoryRouter } from "./routers/product-category";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	user: userRouter,
	blog: blogRouter,
	product: productRouter,
	productCategory: productCategoryRouter,
	image: imageRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
