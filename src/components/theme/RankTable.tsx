import { DoubleRightOutlined } from "@ant-design/icons";
import { useState } from "react";

import RankList from "@/components/theme/RankList";
import { api } from "@/plugins/trpc/api";

import type { RankItemProps } from "./RankItem";
import SiteButton from "./SiteButton";

const RankTable = () => {
	const [page, setPage] = useState(1);
	const productQuery = api.product.getAll.useQuery({
		pagination: { itemPerPage: 50, page },
		orderBy: [{ voteCount: "desc" }, { createdAt: "desc" }, { updatedAt: "desc" }],
	});
	const { data: result = { data: [], pagination: undefined } } = productQuery;
	const { data: list, pagination } = result;
	// console.log("pagination :>> ", pagination);

	return (
		<div className="w-full max-w-3xl">
			<RankList
				dataSource={list.map(
					(item: any) =>
						({
							...item,
							href: `https://${item.url}?ref=toprankingai`,
							target: "_blank",
						}) as RankItemProps
				)}
				// dataSource={[
				// 	{
				// 		type: "primary",
				// 		rank: "01",
				// 		title: "Ultimate Free Online Teleprompter",
				// 		desc: "Speak with confidence, no one will know there's a script",
				// 		tags: ["#marketing", "#productivity", "#seo"],
				// 	},
				// ]}
			/>
			{pagination?.page === pagination?.total_pages ? null : (
				<div className="py-10 text-center">
					<SiteButton type="tertiary" leadIcon={<DoubleRightOutlined className="rotate-90" />}>
						Show more
					</SiteButton>
				</div>
			)}
		</div>
	);
};

export default RankTable;
