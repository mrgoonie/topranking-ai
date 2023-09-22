import { z } from "zod";

import checkAuthenticated from "@/server/api/routers/helpers/checkAuthenticated";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

const inputSchema = z.object({
	newRoleId: z.string(),
});

export const userRouter = createTRPCRouter({
	getProfile: protectedProcedure.query(({ input, ctx }) => {
		const user = checkAuthenticated(ctx);

		const { id } = user;

		return ctx.prisma.user.findUnique({
			where: { id },
		});
	}),

	getRole: protectedProcedure.query(async ({ input, ctx }) => {
		const user = checkAuthenticated(ctx);
		const { id } = user;

		const userWithRoles = await ctx.prisma.user.findUnique({
			where: { id },
			include: {
				userRoles: {
					include: {
						role: true,
					},
				},
			},
		});

		const roles = userWithRoles?.userRoles.map((ur: any) => ur.role);

		return roles;
	}),

	updateRole: protectedProcedure.input(inputSchema).mutation(async ({ input, ctx }) => {
		const user = checkAuthenticated(ctx);
		const { id: userId } = user;

		// Validate input against schema
		const { newRoleId } = inputSchema.parse(input);

		// 1. Remove all roles currently associated with the user
		await ctx.prisma.userRole.deleteMany({
			where: {
				userId,
			},
		});

		// 2. Associate the new role with the user
		await ctx.prisma.userRole.create({
			data: {
				userId,
				roleId: newRoleId,
			},
		});

		// Optionally, return the updated user with roles
		const res = await ctx.prisma.user.findUnique({
			where: { id: userId },
			include: { userRoles: true },
		});
		return res;
	}),
});
