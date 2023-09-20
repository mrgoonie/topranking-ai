import "@/styles/globals.scss";

import { ConfigProvider, theme } from "antd";
import type { AppType } from "next/app";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "@/plugins/trpc/api";

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
	return (
		<ConfigProvider
			theme={{
				algorithm: theme.darkAlgorithm,
			}}
		>
			<SessionProvider session={session}>
				<Component {...pageProps} />
			</SessionProvider>
		</ConfigProvider>
	);
};

export default api.withTRPC(MyApp);

(async () => {
	const { configProduction } = await import("@/config/configProduction");
	configProduction.consoleHandle();
})();
