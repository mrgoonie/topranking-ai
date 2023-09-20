import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { type ReactNode, useEffect } from "react";
import { useDarkMode } from "usehooks-ts";

import { Meta } from "@/components/layouts/Meta";

import SiteFooter from "../theme/SiteFooter";
import SiteHeader from "../theme/SiteHeader";

const Providers = dynamic(() => import("@/components/context/compose/Providers"), { ssr: false });

interface IMainProps {
	meta?: { title?: string; description?: string };
	children?: ReactNode;
}

const MasterPage = (props: IMainProps) => {
	const router = useRouter();
	const title = props.meta?.title || "";
	const { isDarkMode } = useDarkMode();

	useEffect(() => {
		(async () => {
			const gaPage = (await import("@/plugins/tracking")).gaPage;
			const gaIds = (await import("@/plugins/tracking")).gaIds;
			try {
				if (gaIds?.length) {
					gaPage(router.asPath, title);
				}
			} catch (error) {
				console.error(`metname error`, error);
			}
		})();
		return () => {};
	}, [router.asPath, title]);

	return (
		<>
			<Meta title={title} description={props.meta?.description} />

			<main className={`flex min-h-screen w-full max-w-[1180px] flex-col items-center`}>
				<SiteHeader />

				<Providers {...props}>{props.children}</Providers>

				<div className="grow" />

				<SiteFooter />
			</main>
		</>
	);
};

export default MasterPage;
