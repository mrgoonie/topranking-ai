import Link from "next/link";
import type { ReactNode } from "react";

import type { BaseComponentProps } from "./ComponentProps";

interface HashtagProps extends BaseComponentProps {
	href?: string;
	target?: React.HTMLAttributeAnchorTarget;
	onClick?: React.MouseEventHandler<any>;
}

const Hashtag = (props?: HashtagProps) => {
	const wrapper = (children?: ReactNode) =>
		props?.href ? (
			<Link href={props?.href ?? "#"} target={props?.target ?? "_self"}>
				{children}
			</Link>
		) : (
			<div onClick={props?.onClick}>{children}</div>
		);
	return wrapper(
		<span className="whitespace-nowrap text-xs font-normal leading-[18px] tracking-tight text-indigo-300 transition-colors hover:text-indigo-200">
			{props?.children ?? "#hashtag"}
		</span>
	);
};

export default Hashtag;
