import { BulbOutlined } from "@ant-design/icons";
import { Alert } from "antd";
import Link from "next/link";

import type { BaseComponentProps } from "./ComponentProps";

interface WelcomePanelProps extends BaseComponentProps {}

const WelcomePanel = (props?: WelcomePanelProps) => {
	return (
		<Alert
			message={
				<h1 className="text-2xl">
					Welcome to <strong className="text-electric-green">TopRanking.AI</strong> ! 👋
				</h1>
			}
			description={
				<span className="text-neutral-400">
					The place to discover and vote for new AI products. Don’t see your AI products?{" "}
					<Link href="/submit">
						<strong>Submit now</strong>
					</Link>
					.
				</span>
			}
			type="info"
			showIcon
			icon={<BulbOutlined />}
		/>
	);
};

export default WelcomePanel;
