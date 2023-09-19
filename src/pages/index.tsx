import { BulbOutlined, HomeOutlined } from "@ant-design/icons";
import { Alert } from "antd";
import Link from "next/link";

import MasterPage from "@/components/layouts/MasterPage";
import CategoryBtn from "@/components/theme/CategoryBtn";
import CategoryGroup from "@/components/theme/CategoryGroup";
import RankList from "@/components/theme/RankList";
import SiteFooter from "@/components/theme/SiteFooter";
import SiteHeader from "@/components/theme/SiteHeader";

export default function Home() {
	return (
		<MasterPage meta={{ title: "Home" }}>
			<main className={`flex w-full min-h-screen max-w-[1180px] flex-col items-center`}>
				<SiteHeader />

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

				<CategoryGroup />

				<div className="grow" />

				<RankList />

				<SiteFooter />
			</main>
		</MasterPage>
	);
}
