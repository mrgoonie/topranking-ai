import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	/**
	 * Specify your server-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars.
	 */
	server: {
		NEXT_PUBLIC_BASE_URL: z.string().url().optional(),
		DATABASE_URL: z.string().url().optional(),
		NODE_ENV: z.enum(["development", "test", "production"]),
		JWT_SECRET: z.string().optional(),
		NEXTAUTH_SECRET: z.string().optional(),
		NEXTAUTH_URL: z.preprocess(
			// This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
			// Since NextAuth.js automatically uses the VERCEL_URL if present.
			(str) => process.env.VERCEL_URL ?? str,
			// VERCEL_URL doesn't include `https` so it cant be validated as a URL
			process.env.VERCEL ? z.string().min(1) : z.string().url().optional()
		),
		// Add `.min(1) on ID and SECRET if you want to make sure they're not empty
		NEXT_PUBLIC_DISCORD_CLIENT_ID: z.string().optional(),
		DISCORD_CLIENT_SECRET: z.string().optional(),
		NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().optional(),
		GOOGLE_CLIENT_SECRET: z.string().optional(),
		NEXT_PUBLIC_GITHUB_ID: z.string().optional(),
		GITHUB_SECRET: z.string().optional(),
		NEXT_PUBLIC_BATTLENET_CLIENT_ID: z.string().optional(),
		BATTLENET_CLIENT_SECRET: z.string().optional(),
		BATTLENET_ISSUER: z.string().optional(),
		NEXT_PUBLIC_APPLE_ID: z.string().optional(),
		APPLE_SECRET: z.string().optional(),
		NEXT_PUBLIC_FACEBOOK_CLIENT_ID: z.string().optional(),
		FACEBOOK_CLIENT_SECRET: z.string().optional(),
		GOOGLE_SERVICE_ACCOUNT: z.string().optional(),
		GOOGLE_STORAGE_BUCKET: z.string().default("digitop-cdn-sg"),
		GOOGLE_ANALYTICS: z.string().optional(),
		NEXT_PUBLIC_GA: z.string().optional(),
	},

	/**
	 * Specify your client-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars. To expose them to the client, prefix them with
	 * `NEXT_PUBLIC_`.
	 */
	client: {
		NEXT_PUBLIC_DISCORD_CLIENT_ID: z.string().optional(),
		NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().optional(),
		NEXT_PUBLIC_GITHUB_ID: z.string().optional(),
		NEXT_PUBLIC_BATTLENET_CLIENT_ID: z.string().optional(),
		NEXT_PUBLIC_APPLE_ID: z.string().optional(),
		NEXT_PUBLIC_FACEBOOK_CLIENT_ID: z.string().optional(),
		NEXT_PUBLIC_GA: z.string().optional(),
	},

	/**
	 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
	 * middlewares) or client-side so we need to destruct manually.
	 */
	runtimeEnv: {
		NEXT_PUBLIC_BASE_URL: z.string().url().optional(),
		DATABASE_URL: process.env.DATABASE_URL,
		JWT_SECRET: process.env.JWT_SECRET,
		NODE_ENV: process.env.NODE_ENV,
		NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
		NEXTAUTH_URL: process.env.NEXTAUTH_URL,
		NEXT_PUBLIC_DISCORD_CLIENT_ID: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID,
		DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
		NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
		NEXT_PUBLIC_GITHUB_ID: process.env.NEXT_PUBLIC_GITHUB_ID,
		GITHUB_SECRET: process.env.GITHUB_SECRET,
		NEXT_PUBLIC_BATTLENET_CLIENT_ID: process.env.NEXT_PUBLIC_BATTLENET_CLIENT_ID,
		BATTLENET_CLIENT_SECRET: process.env.BATTLENET_CLIENT_SECRET,
		BATTLENET_ISSUER: process.env.BATTLENET_ISSUER,
		NEXT_PUBLIC_APPLE_ID: process.env.NEXT_PUBLIC_APPLE_ID,
		APPLE_SECRET: process.env.APPLE_SECRET,
		NEXT_PUBLIC_FACEBOOK_CLIENT_ID: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID,
		FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
		GOOGLE_SERVICE_ACCOUNT: process.env.GOOGLE_SERVICE_ACCOUNT,
		GOOGLE_STORAGE_BUCKET: process.env.GOOGLE_STORAGE_BUCKET,
		GOOGLE_ANALYTICS: process.env.GOOGLE_ANALYTICS,
		NEXT_PUBLIC_GA: process.env.NEXT_PUBLIC_GA,
	},
	/**
	 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
	 * This is especially useful for Docker builds.
	 */
	skipValidation: true,
});
