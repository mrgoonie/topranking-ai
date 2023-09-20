import { Avatar } from "antd";

import type { BaseComponentProps } from "./ComponentProps";
import Hashtag from "./Hashtag";
import RankIcon from "./RankIcon";
import SiteButtonIcon from "./SiteButtonIcon";

export interface RankItemProps extends BaseComponentProps {
	rank?: string;
	type?: "primary" | "secondary" | "tertiary" | "ghost" | "glass";
	avatar?: string;
	title?: string;
	desc?: string;
	hashtags?: string[];
}

const RankItem = (props?: RankItemProps) => {
	return (
		<div className="flex flex-row items-center gap-5">
			{typeof props?.rank !== "undefined" ? <RankIcon type={props?.type ?? "glass"} value={props?.rank} /> : null}
			<Avatar
				className="!rounded-3xl"
				shape="square"
				size={80}
				src={props?.avatar ?? "https://picsum.photos/100"}
			/>
			<div className="flex flex-grow flex-col gap-1">
				<h3 className="text-xl font-semibold leading-loose text-lime-300">{props?.title}</h3>
				<div>{props?.desc}</div>
				<div className="flex flex-row gap-2">
					{props?.hashtags?.map((hashtag, i) => <Hashtag key={`hashtag-${hashtag}-${i}`}>{hashtag}</Hashtag>)}
				</div>
			</div>
			<SiteButtonIcon type={props?.type ?? "tertiary"}>15M</SiteButtonIcon>
		</div>
	);
};

export default RankItem;
