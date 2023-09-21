import type { BaseComponentProps } from "./ComponentProps";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

const SiteLayout = (props?: BaseComponentProps) => {
	return (
		<main className={`flex min-h-screen w-full max-w-[1180px] flex-col items-center px-4`}>
			<SiteHeader />

			{props?.children}

			<div className="grow" />

			<SiteFooter />
		</main>
	);
};

export default SiteLayout;
