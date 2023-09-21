import { useResponsive } from "ahooks/lib/useResponsive";
import { Avatar } from "antd";
import Link from "next/link";

import type { BaseComponentProps } from "./ComponentProps";
import Hashtag from "./Hashtag";
import RankIcon from "./RankIcon";
import SiteButtonIcon from "./SiteButtonIcon";

export interface RankItemProps extends BaseComponentProps {
	href?: string;
	target?: React.HTMLAttributeAnchorTarget;
	rank?: string;
	type?: "primary" | "secondary" | "tertiary" | "ghost" | "glass";
	avatar?: string;
	title?: string;
	desc?: string;
	hashtags?: string[];
}

const RankItem = (props?: RankItemProps) => {
	const responsive = useResponsive();

	return (
		<div className="flex flex-row gap-2 md:items-center md:gap-5">
			{typeof props?.rank !== "undefined" ? (
				<RankIcon size={responsive.md ? "md" : "sm"} type={props?.type ?? "glass"} value={props?.rank} />
			) : null}
			<Avatar
				className="flex-none !rounded-3xl"
				shape="square"
				size={responsive.md ? 80 : 60}
				src={props?.avatar ?? "https://picsum.photos/100"}
			/>
			<div className="flex flex-grow flex-col gap-1">
				<Link href={props?.href ?? "#"} target={props?.target ?? "_self"}>
					<h3 className="text-lg font-semibold leading-6 text-lime-300 transition-colors hover:text-lime-200 md:text-xl">
						{props?.title}
					</h3>
				</Link>
				<div className="text-sm leading-5 md:text-base">{props?.desc}</div>
				<div className="flex flex-row gap-2">
					{props?.hashtags?.map((hashtag, i) => <Hashtag key={`hashtag-${hashtag}-${i}`}>{hashtag}</Hashtag>)}
				</div>
			</div>
			<SiteButtonIcon type={props?.type ?? "tertiary"}>15M</SiteButtonIcon>
		</div>
	);
};

export default RankItem;
