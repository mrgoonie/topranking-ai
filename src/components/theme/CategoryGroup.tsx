import { MoreOutlined, RiseOutlined } from "@ant-design/icons";

import CategoryButton from "./CategoryButton";
import type { BaseComponentProps } from "./ComponentProps";

interface CategoryGroupProps extends BaseComponentProps {}

const CategoryGroup = (props?: CategoryGroupProps) => {
	return (
		<div className="flex flex-row items-center gap-4 py-6">
			<div className="flex flex-row gap-2">
				<CategoryButton leadIcon={<RiseOutlined />} active>
					All time
				</CategoryButton>
				<CategoryButton>Today</CategoryButton>
			</div>
			<span className="inline-block h-5 border-l" />
			<div className="flex flex-row gap-2">
				<CategoryButton>Generative</CategoryButton>
				<CategoryButton>Content</CategoryButton>
				<CategoryButton>Productivity</CategoryButton>
				<CategoryButton>Marketing</CategoryButton>
				<CategoryButton>SEO</CategoryButton>
				<CategoryButton>
					<MoreOutlined />
				</CategoryButton>
			</div>
		</div>
	);
};

export default CategoryGroup;
