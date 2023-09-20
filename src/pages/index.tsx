import MasterPageAuth from "@/components/layouts/MasterPageAuth";
import CategoryGroup from "@/components/theme/CategoryGroup";
import RankTable from "@/components/theme/RankTable";
import SiteLayout from "@/components/theme/SiteLayout";
import WelcomePanel from "@/components/theme/WelcomePanel";

export default function Home() {
	return (
		<MasterPageAuth meta={{ title: "Home" }}>
			<SiteLayout>
				<WelcomePanel />
				<CategoryGroup />
				<RankTable />
			</SiteLayout>
		</MasterPageAuth>
	);
}
