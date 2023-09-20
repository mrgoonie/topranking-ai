import Image from "next/image";
import Link from "next/link";
import React from "react";

import type { BaseComponentProps } from "./ComponentProps";

interface SiteFooterProps extends BaseComponentProps {}

const SiteFooter = (props?: SiteFooterProps) => {
	return (
		<div className="flex w-full max-w-md flex-col items-center border-t border-t-neutral-600 pb-6 text-center">
			<p className="w-full py-5">
				Copyright © 2023 - Made with ❤️ by{" "}
				<Link
					href="https://wearetopgroup.com/?ref=toprankingai"
					target="_blank"
					className="font-semibold text-electric-green"
				>
					T.O.P Group
				</Link>
			</p>
			<div className="flex items-center gap-10">
				<Link href="#">
					<Image src="/images/icons/facebook.svg" width={8} height={16} alt="facebook" />
				</Link>
				<Link href="#">
					<Image src="/images/icons/twitter.svg" width={15} height={13} alt="twitter" />
				</Link>
				<Link href="#">
					<Image src="/images/icons/linkedin.svg" width={15} height={14} alt="linkedin" />
				</Link>
				<Link href="#">
					<Image src="/images/icons/youtube.svg" width={15} height={10} alt="youtube" />
				</Link>
			</div>
		</div>
	);
};

export default SiteFooter;
