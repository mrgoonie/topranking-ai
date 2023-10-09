import { DoubleRightOutlined } from "@ant-design/icons";
import type { Product } from "@prisma/client";
import useMap from "ahooks/lib/useMap";
import { useEffect, useState } from "react";

import RankList from "@/components/theme/RankList";
import { useRouterQuery } from "@/plugins/next-router/useRouterQuery";
import { api } from "@/plugins/trpc/api";

import { useUser } from "../context/UserProvider";
import type { RankItemProps } from "./RankItem";
import SiteButton from "./SiteButton";

const RankTable = () => {
	// auth
	const { user } = useUser();

	// category
	const [query] = useRouterQuery();
	const { category: categorySlug } = query;
	// console.log("query :>> ", query);

	const [page, setPage] = useState(1);
	const productQuery = api.product.getAll.useQuery({
		include: { categories: { select: { id: true, name: true, slug: true } } },
		filter: { inCategories: categorySlug ? [categorySlug] : [] },
		pagination: { itemPerPage: 50, page },
		orderBy: [{ voteCount: "desc" }, { createdAt: "desc" }, { updatedAt: "desc" }],
	});
	const { data: result = { data: [], pagination: undefined } } = productQuery;
	const { data: list, pagination } = result;
	// console.log("list :>> ", list);

	const [collection, { set: addToCollection, reset: resetCollection }] = useMap<string, RankItemProps>([]);
	// console.log("pagination :>> ", pagination);

	const handlerShowMoreClick = async () => {
		if (pagination && page <= pagination?.total_pages) setPage(page + 1);
	};

	useEffect(() => {
		resetCollection();
	}, [categorySlug]);

	useEffect(() => {
		list?.map((item: Product, i) => {
			const catArr = (item as Product & { categories: { id: string; name: string; slug: string }[] }).categories;
			const isVoted = user?.id ? item.voterIds.includes(user.id) : false;

			addToCollection(item.id, {
				id: item.id,
				imageUrl: item.imageUrl,
				title: item.title,
				desc: item.desc,
				tags: item.tags,
				voteCount: item.voteCount,
				isVoted,
				categories: catArr,
				href: `https://${item.url}?ref=toprankingai`,
				target: "_blank",
			} as RankItemProps);
		});
	}, [list, user?.id]);

	return (
		<div className="w-full max-w-3xl">
			<RankList
				dataSource={Array.from(collection.values())}
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
			{page === pagination?.total_pages ? null : (
				<div className="py-10 text-center">
					<SiteButton
						type="tertiary"
						leadIcon={<DoubleRightOutlined className="rotate-90" />}
						onClick={() => handlerShowMoreClick()}
					>
						Show more
					</SiteButton>
				</div>
			)}
		</div>
	);
};

export default RankTable;
