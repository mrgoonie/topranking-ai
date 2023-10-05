import { MoreOutlined, RiseOutlined } from "@ant-design/icons";

import { useRouterQuery } from "@/plugins/next-router/useRouterQuery";
import { api } from "@/plugins/trpc/api";

import CategoryButton from "./CategoryButton";
import type { BaseComponentProps } from "./ComponentProps";

interface CategoryGroupProps extends BaseComponentProps {}

const CategoryGroup = (props?: CategoryGroupProps) => {
	const [query, { setQuery, deleteQuery }] = useRouterQuery();

	// get top 5 categories with most products
	const top5Query = api.productCategory.getAll.useQuery({
		// include: { _count: { select: { products: true } } },
		offset: { take: 5 },
		orderBy: [{ products: { _count: "desc" } }, { updatedAt: "desc" }, { createdAt: "desc" }],
	});
	const { data: result = { data: [], pagination: undefined } } = top5Query;
	const { data: top5List } = result;
	console.log("top5List :>> ", top5List);

	// get another top 10 categories
	const moreQuery = api.productCategory.getAll.useQuery({
		include: { _count: { select: { products: true } } },
		offset: { take: 10, skip: 5 },
		orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
	});
	const { data: moreResult = { data: [], pagination: undefined } } = moreQuery;
	const { data: moreList } = moreResult;
	// console.log("moreList :>> ", moreList);

	return (
		<div className="flex flex-row flex-wrap items-center justify-center gap-2 py-6">
			<CategoryButton
				leadIcon={<RiseOutlined />}
				active={query.time === "all" || typeof query.time === "undefined"}
				onClick={(e) => deleteQuery(["time"])}
			>
				All time
			</CategoryButton>
			<CategoryButton active={query.time === "today"} onClick={(e) => setQuery({ time: "today" })}>
				Today
			</CategoryButton>
			<span className="ml-2 inline-block h-5 border-l pr-2" />
			<CategoryButton active={typeof query.category === "undefined"} onClick={(e) => deleteQuery(["category"])}>
				All
			</CategoryButton>
			{top5List.map((item) => (
				<CategoryButton
					key={`cat-btn-${item.slug}`}
					active={query.category === item.slug}
					onClick={(e) =>
						query.category === item.slug ? deleteQuery(["category"]) : setQuery({ category: item.slug })
					}
				>
					{item.name}
				</CategoryButton>
			))}
			{/* <CategoryButton>Generative</CategoryButton>
			<CategoryButton>Content</CategoryButton>
			<CategoryButton>Productivity</CategoryButton>
			<CategoryButton>Marketing</CategoryButton>
			<CategoryButton>SEO</CategoryButton> */}
			<CategoryButton>
				<MoreOutlined />
			</CategoryButton>
		</div>
	);
};

export default CategoryGroup;
