import Link from "next/link";

import type { BaseComponentProps } from "./ComponentProps";

interface HashtagProps extends BaseComponentProps {
	href?: string;
	target?: React.HTMLAttributeAnchorTarget;
}

const Hashtag = (props?: HashtagProps) => {
	return (
		<Link href={props?.href ?? "#"} target={props?.target ?? "_self"}>
			<span className="whitespace-nowrap text-xs font-normal leading-[18px] tracking-tight text-indigo-300 transition-colors hover:text-indigo-200">
				{props?.children ?? "#hashtag"}
			</span>
		</Link>
	);
};

export default Hashtag;
