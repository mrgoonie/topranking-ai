import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import React from "react";

import type { BaseComponentProps } from "./ComponentProps";
import SiteLogo from "./SiteLogo";
import ThemeButton from "./ThemeButton";

interface SiteHeaderProps extends BaseComponentProps {}

const SiteHeader = (props?: SiteHeaderProps) => {
	return (
		<div className="flex w-full items-center py-6">
			<div className="flex items-center gap-4">
				<SiteLogo href="/" wrapperStyle={{ width: `240px` }} />
				<Input prefix={<SearchOutlined />} size="large" placeholder="Search (Cmd + K)" />
				<ThemeButton type="ghost" href="/about">
					About
				</ThemeButton>
			</div>
			<div className="grow" />
			<div className="flex-none">
				<ThemeButton href="/submit">Submit AI</ThemeButton>
			</div>
		</div>
	);
};

export default SiteHeader;
