import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import { type DefaultSession, getServerSession, type NextAuthOptions } from "next-auth";
import BattleNetProvider from "next-auth/providers/battlenet";
import CredentialsProvider from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";
import FacebookProvider from "next-auth/providers/facebook";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { AppConfig } from "@/config/AppConfig";
import { env } from "@/env.mjs";
import { prisma } from "@/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
	interface Session extends DefaultSession {
		user: DefaultSession["user"] & {
			id: string;
			// ...other properties
			// role: UserRole;
		};
	}

	// interface User {
	//   // ...other properties
	//   // role: UserRole;
	// }
}

const providers = [];
if (env.NEXT_PUBLIC_DISCORD_CLIENT_ID) {
	providers.push(
		DiscordProvider({
			clientId: env.NEXT_PUBLIC_DISCORD_CLIENT_ID as string,
			clientSecret: env.DISCORD_CLIENT_SECRET as string,
			profile(profile) {
				return {
					providerAccountId: `DISCORD-${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}-${profile.id}`,
					id: profile.id,
					name: profile.username,
					email: null,
					emailOriginal: profile.email,
					image: profile.image_url,
				};
			},
		})
	);
}
if (env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
	providers.push(
		GoogleProvider({
			clientId: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
			clientSecret: env.GOOGLE_CLIENT_SECRET as string,
			profile(profile) {
				return {
					providerAccountId: `GOOGLE-${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}-${profile.sub}`,
					id: profile.sub,
					name: profile.name,
					email: null,
					emailOriginal: profile.email,
					image: profile.picture,
				};
			},
		})
	);
}

if (env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID) {
	providers.push(
		FacebookProvider({
			clientId: env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID as string,
			clientSecret: env.FACEBOOK_CLIENT_SECRET as string,
			profile(profile: any) {
				return {
					providerAccountId: `FACEBOOK-${process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID}-${profile.id}`,
					id: profile.id,
					name: profile.name,
					email: null,
					emailOriginal: profile.email,
					image: profile.picture.data.url,
				};
			},
		})
	);
}
if (env.NEXT_PUBLIC_GITHUB_ID) {
	providers.push(
		GitHubProvider({
			clientId: process.env.NEXT_PUBLIC_GITHUB_ID as string,
			clientSecret: process.env.GITHUB_SECRET as string,
			profile(profile) {
				return {
					providerAccountId: `GITHUB-${process.env.NEXT_PUBLIC_GITHUB_ID}-${profile.id}`,
					id: profile.id.toString(),
					name: profile.name ?? profile.login,
					email: null,
					emailOriginal: profile.email,
					image: profile.avatar_url,
				};
			},
		})
	);
}
if (env.NEXT_PUBLIC_BATTLENET_CLIENT_ID) {
	providers.push(
		BattleNetProvider({
			clientId: process.env.NEXT_PUBLIC_BATTLENET_CLIENT_ID as string,
			clientSecret: process.env.BATTLENET_CLIENT_SECRET as string,
			issuer: process.env.BATTLENET_ISSUER as
				| "https://www.battlenet.com.cn/oauth"
				| "https://us.battle.net/oauth"
				| "https://eu.battle.net/oauth"
				| "https://kr.battle.net/oauth"
				| "https://tw.battle.net/oauth",
			profile(profile: any) {
				return {
					providerAccountId: `BATTLENET-${process.env.NEXT_PUBLIC_BATTLENET_CLIENT_ID}-${profile.sub}`,
					id: profile.sub,
					name: profile.battle_tag,
					email: null,
					image: null,
				};
			},
		})
	);
}

providers.push(
	CredentialsProvider({
		id: "domain-login",
		name: "Domain Account",
		async authorize(credentials, req) {
			//

			throw new Error("Lỗi cmnr !");

			//

			/* add function to get user */

			const user = {
				id: "64e5b1acaf2d53812cb962fa", //FOR TEST ONLY
			};
			return user;
		},
		credentials: {
			username: { label: "Username", type: "text ", placeholder: "jsmith" },
			password: { label: "Password", type: "password" },
		},
	})
);

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
	callbacks: {
		async jwt({ token, user, account }) {
			// console.log("JWT token, user, account  :>> ", token, user, account);
			// console.log("JWT token :>> ", token);
			// console.log("JWT user :>> ", user);
			// console.log("JWT account :>> ", account);
			// token.tokenId = token.token;
			// if (user) {
			// 	if (typeof user === "string") {
			// 		// console.log('Empty block statement.');
			// 	} else {
			// 		const { token: tokenData } = user as any;
			// 		if (tokenData) token.tokenId = tokenData;
			// 		token = {
			// 			...token,
			// 			...user,
			// 		};
			// 	}
			// }
			// if (account?.provider === "google") {
			// 	token.access_token = account.access_token;
			// }
			return token;
		},

		async session({ session, user, token }) {
			// console.log("session :>> ", session, user, token);

			// console.log("SESSION session :>> ", session);
			// console.log("SESSION user :>> ", user);
			// console.log("SESSION token :>> ", token);

			const { name, email } = session.user;

			// await Timer.wait(1000);

			return {
				...session,
				user: {
					name,
					id: token?.sub,
				},
			};
		},
	},

	events: {
		async signIn(message) {
			/* on successful sign in */
		},
		async signOut(message) {
			/* on signout */
		},
		async createUser(message) {
			/* user created */
		},
		async updateUser(message) {
			/* user updated - e.g. their email was verified */
		},
		async linkAccount(message) {
			/* account (e.g. Twitter) linked to a user */
		},
		async session(message) {
			/* session is active */
		},
	},

	adapter: PrismaAdapter(prisma),

	providers,

	session: {
		strategy: "jwt",
	},
	jwt: {
		secret: env.JWT_SECRET,
		// The maximum age of the NextAuth.js issued JWT in seconds.
		// Defaults to `session.maxAge`.
		maxAge: 60 * 60 * 24 * 30,
		// You can define your own encode/decode functions for signing and encryption
		// async encode() {},
		// async decode() {},
	},

	pages: {
		signIn: AppConfig.getBasePath("/"),
		signOut: AppConfig.getBasePath("/logout"),
		error: AppConfig.getBasePath("/logout"),
		verifyRequest: AppConfig.getBasePath("/"),
		newUser: AppConfig.getBasePath("/"),
	},
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
	req: GetServerSidePropsContext["req"];
	res: GetServerSidePropsContext["res"];
}) => {
	return getServerSession(ctx.req, ctx.res, authOptions);
};
