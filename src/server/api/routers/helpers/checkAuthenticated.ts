export default function checkAuthenticated(ctx: any) {
	if (!ctx?.session?.user) throw new Error("Not authenticated");
	return ctx.session.user;
}
