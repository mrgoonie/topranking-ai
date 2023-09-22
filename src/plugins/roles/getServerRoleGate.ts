import { getServerAuthSession } from "@/server/auth";

export default async function getServerRoleGate(ctx: any, roles: Array<string>) {
	//

	const session = await getServerAuthSession(ctx);
	const id = session?.user.id;

	const PrismaClient = (await import("@prisma/client")).PrismaClient;
	const prisma = new PrismaClient();

	const userWithRoles = await prisma.user.findUnique({
		where: {
			id,
		},
		select: {
			userRoles: {
				include: {
					role: {
						select: {
							name: true,
						},
					},
				},
			},
		},
	});
	const userRoles = userWithRoles?.userRoles.map((ur: any) => ur.role.name) || [];

	const allowRoles = new Set(["Admin", ...roles]);

	const _list = userRoles.filter((item: any) => allowRoles.has(item));

	if (_list.length > 0) {
		return {
			props: { session },
		};
	} else {
		//
		return {
			redirect: {
				destination: "/role",
				permanent: false,
			},
		};
	}
}
