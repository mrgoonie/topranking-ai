import { LoadingOutlined } from "@ant-design/icons";

import { useUser } from "../context/UserProvider";
import type { BaseComponentProps } from "./ComponentProps";
import LoginPanel from "./LoginPanel";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

export interface SiteLayoutProps extends BaseComponentProps {
	protected?: boolean;
}

const SiteLayout = (props?: SiteLayoutProps) => {
	const { status } = useUser();

	return (
		<main className={`flex min-h-screen w-full max-w-[1180px] flex-col items-center px-4`}>
			<SiteHeader />

			{props?.protected ? (
				status === "loading" ? (
					<LoadingOutlined />
				) : status === "unauthenticated" ? (
					<LoginPanel />
				) : (
					props?.children
				)
			) : (
				props?.children
			)}

			<div className="grow" />

			<SiteFooter />
		</main>
	);
};

export default SiteLayout;
