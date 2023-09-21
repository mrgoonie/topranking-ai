import { MoreOutlined, RiseOutlined } from "@ant-design/icons";

import CategoryButton from "./CategoryButton";
import type { BaseComponentProps } from "./ComponentProps";

interface CategoryGroupProps extends BaseComponentProps {}

const CategoryGroup = (props?: CategoryGroupProps) => {
	return (
		<div className="flex flex-row flex-wrap items-center justify-center gap-2 py-6">
			<CategoryButton leadIcon={<RiseOutlined />} active>
				All time
			</CategoryButton>
			<CategoryButton>Today</CategoryButton>
			<span className="ml-2 inline-block h-5 border-l pr-2" />
			<CategoryButton>Generative</CategoryButton>
			<CategoryButton>Content</CategoryButton>
			<CategoryButton>Productivity</CategoryButton>
			<CategoryButton>Marketing</CategoryButton>
			<CategoryButton>SEO</CategoryButton>
			<CategoryButton>
				<MoreOutlined />
			</CategoryButton>
		</div>
	);
};

export default CategoryGroup;
