import { MoreOutlined, RiseOutlined } from "@ant-design/icons";
import React from "react";

import CategoryBtn from "./CategoryBtn";
import type { BaseComponentProps } from "./ComponentProps";

interface CategoryGroupProps extends BaseComponentProps {}

const CategoryGroup = (props?: CategoryGroupProps) => {
	return (
		<div className="flex flex-row gap-4 items-center py-6">
			<div className="flex flex-row gap-2">
				<CategoryBtn leadIcon={<RiseOutlined />}>All time</CategoryBtn>
				<CategoryBtn>Today</CategoryBtn>
			</div>
			<span className="inline-block border-l h-5" />
			<div className="flex flex-row gap-2">
				<CategoryBtn>Generative</CategoryBtn>
				<CategoryBtn>Content</CategoryBtn>
				<CategoryBtn>Productivity</CategoryBtn>
				<CategoryBtn>Marketing</CategoryBtn>
				<CategoryBtn>SEO</CategoryBtn>
				<CategoryBtn>
					<MoreOutlined />
				</CategoryBtn>
			</div>
		</div>
	);
};

export default CategoryGroup;
