import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";

import type { BaseComponentProps } from "./ComponentProps";
import SiteButton from "./SiteButton";
import SiteLogo from "./SiteLogo";

interface SiteHeaderProps extends BaseComponentProps {}

const SiteHeader = (props?: SiteHeaderProps) => {
	return (
		<div className="flex w-full items-center py-6">
			<div className="flex items-center gap-4">
				<SiteLogo href="/" wrapperStyle={{ width: `240px` }} />
				<Input prefix={<SearchOutlined />} size="large" placeholder="Search (Cmd + K)" />
				<SiteButton type="ghost" href="/about">
					About
				</SiteButton>
			</div>
			<div className="grow" />
			<div className="flex-none">
				<SiteButton href="/submit">Submit AI</SiteButton>
			</div>
		</div>
	);
};

export default SiteHeader;
