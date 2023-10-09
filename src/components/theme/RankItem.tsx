import { useResponsive } from "ahooks/lib/useResponsive";
import { Avatar, notification } from "antd";
import Link from "next/link";

import { useRouterQuery } from "@/plugins/next-router/useRouterQuery";
import { api } from "@/plugins/trpc/api";

import type { BaseComponentProps } from "./ComponentProps";
import Hashtag from "./Hashtag";
import RankIcon from "./RankIcon";
import SiteButtonIcon from "./SiteButtonIcon";

export interface RankItemProps extends BaseComponentProps {
	id?: string;
	href?: string;
	target?: React.HTMLAttributeAnchorTarget;
	rank?: string;
	type?: "primary" | "secondary" | "tertiary" | "ghost" | "glass";
	imageUrl?: string;
	title?: string;
	desc?: string;
	tags?: string[];
	categories?: { id: string; name: string; slug: string }[];
	voteCount?: number;
	isVoted?: boolean;
}

const RankItem = (props?: RankItemProps) => {
	const [query, { setQuery }] = useRouterQuery();

	const responsive = useResponsive();

	const voteApi = api.product.upvote.useMutation();
	const apiCtx = api.useContext();

	const upvoteHandler = async (id?: string) => {
		if (!id) {
			// notification.error(`Unable to upvote.`);
			return;
		}
		voteApi
			.mutateAsync(id)
			.then((result) => {
				console.log("Upvoted > result :>> ", result);
				apiCtx.product.getAll.invalidate();
				notification.success({ message: `Upvoted successfully!`, description: `Thank you for voting.` });
			})
			.catch((err) => {
				notification.error({ message: err.message.toString() });
			});
	};

	return (
		<div className="flex flex-row gap-2 md:items-center md:gap-5">
			{typeof props?.rank !== "undefined" ? (
				<RankIcon size={responsive.md ? "md" : "sm"} type={props?.type ?? "glass"} value={props?.rank} />
			) : null}
			<Avatar
				className="flex-none !rounded-3xl"
				shape="square"
				size={responsive.md ? 80 : 60}
				src={props?.imageUrl ?? "https://picsum.photos/100"}
			/>
			{/* DESCRIPTION */}
			<div className="flex flex-grow flex-col gap-1">
				<Link href={props?.href ?? "#"} target={props?.target ?? "_self"}>
					<h3 className="text-lg font-semibold leading-6 text-lime-300 transition-colors hover:text-lime-200 md:text-xl">
						{props?.title}
					</h3>
				</Link>
				<div className="text-sm leading-5 md:text-base">{props?.desc}</div>
				<div className="flex flex-row flex-wrap gap-x-2 gap-y-0">
					{props?.categories?.map((cat, i) => (
						<Hashtag key={`hashtag-${cat.id}`} onClick={() => setQuery({ category: cat.slug })}>
							#{cat.slug}
						</Hashtag>
					))}
				</div>
			</div>

			<SiteButtonIcon
				type={props?.isVoted === true ? "secondary" : props?.type ?? "tertiary"}
				tooltip={props?.isVoted === true ? "Upvoted!" : "I use this!"}
				onClick={() => upvoteHandler(props?.id)}
			>
				{props?.voteCount}
			</SiteButtonIcon>
		</div>
	);
};

export default RankItem;
