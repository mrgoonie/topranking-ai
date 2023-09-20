import { HomeOutlined } from "@ant-design/icons";

import MasterPage from "@/components/layouts/MasterPage";
import CategoryButton from "@/components/theme/CategoryButton";
import RankList from "@/components/theme/RankList";
import SiteButton from "@/components/theme/SiteButton";
import SiteButtonIcon from "@/components/theme/SiteButtonIcon";
import SiteHeader from "@/components/theme/SiteHeader";

export default function Home() {
	return (
		<MasterPage meta={{ title: "Home" }}>
			<main className={`flex min-h-screen w-full max-w-[1180px] flex-col items-center`}>
				<SiteHeader />

				{/* Category Buttons */}
				<div className="mb-6 flex gap-1">
					<CategoryButton>Category</CategoryButton>
					<CategoryButton active>Active Category</CategoryButton>
				</div>

				{/* Buttons */}
				<div className="mb-6 flex gap-1">
					<div className="flex flex-wrap gap-2">
						<SiteButton href="https://google.com" target="_blank">
							Google
						</SiteButton>
						<SiteButton type="secondary">About Us</SiteButton>
						<SiteButton type="tertiary">About Us</SiteButton>
						<SiteButton type="ghost">About Us</SiteButton>
						<SiteButton type="glass">About Us</SiteButton>
					</div>
					<div className="flex flex-wrap gap-2">
						<SiteButton leadIcon={<HomeOutlined />}>About Us</SiteButton>
						<SiteButton leadIcon={<HomeOutlined />} type="secondary">
							About Us
						</SiteButton>
						<SiteButton leadIcon={<HomeOutlined />} type="tertiary">
							About Us
						</SiteButton>
						<SiteButton leadIcon={<HomeOutlined />} type="ghost">
							About Us
						</SiteButton>
						<SiteButton leadIcon={<HomeOutlined />} type="glass">
							About Us
						</SiteButton>
					</div>
					<div className="flex flex-wrap gap-2">
						<SiteButton trailIcon={<HomeOutlined />}>About Us</SiteButton>
						<SiteButton trailIcon={<HomeOutlined />} type="secondary">
							About Us
						</SiteButton>
						<SiteButton trailIcon={<HomeOutlined />} type="tertiary">
							About Us
						</SiteButton>
						<SiteButton trailIcon={<HomeOutlined />} type="ghost">
							About Us
						</SiteButton>
						<SiteButton trailIcon={<HomeOutlined />} type="glass">
							About Us
						</SiteButton>
					</div>
					<div className="flex flex-wrap gap-2">
						<SiteButton active>About Us</SiteButton>
						<SiteButton active type="secondary">
							About Us
						</SiteButton>
						<SiteButton active type="tertiary">
							About Us
						</SiteButton>
						<SiteButton active type="ghost">
							About Us
						</SiteButton>
						<SiteButton active type="glass">
							About Us
						</SiteButton>
					</div>
				</div>

				{/* Button Icon */}
				<div className="flex gap-6">
					<div className="mb-6 flex gap-1">
						<SiteButtonIcon href="https://google.com" target="_blank">
							123
						</SiteButtonIcon>
						<SiteButtonIcon type="secondary">1.4K</SiteButtonIcon>
						<SiteButtonIcon type="tertiary">15M</SiteButtonIcon>
						<SiteButtonIcon type="ghost">18.2M</SiteButtonIcon>
						<SiteButtonIcon type="glass">100K</SiteButtonIcon>
					</div>

					<div className="mb-6 flex gap-1">
						<SiteButtonIcon active href="https://google.com" target="_blank">
							123
						</SiteButtonIcon>
						<SiteButtonIcon active type="secondary">
							1.4K
						</SiteButtonIcon>
						<SiteButtonIcon active type="tertiary">
							15M
						</SiteButtonIcon>
						<SiteButtonIcon active type="ghost">
							18.2M
						</SiteButtonIcon>
						<SiteButtonIcon active type="glass">
							100K
						</SiteButtonIcon>
					</div>
				</div>

				{/* Rank List & Item */}
				<div className="w-full max-w-2xl">
					<RankList
						dataSource={[
							{
								type: "primary",
								rank: "01",
								title: "Ultimate Free Online Teleprompter",
								desc: "Speak with confidence, no one will know there's a script",
								hashtags: ["#marketing", "#productivity", "#seo"],
							},
							{
								rank: "02",
								title: "Ultimate Free Online Teleprompter",
								desc: "Speak with confidence, no one will know there's a script",
								hashtags: ["#marketing", "#productivity", "#seo"],
							},
							{
								rank: "03",
								title: "Ultimate Free Online Teleprompter",
								desc: "Speak with confidence, no one will know there's a script",
								hashtags: ["#marketing", "#productivity", "#seo"],
							},
							{
								title: "Ultimate Free Online Teleprompter",
								desc: "Speak with confidence, no one will know there's a script",
								hashtags: ["#marketing", "#productivity", "#seo"],
							},
						]}
					/>
				</div>
			</main>
		</MasterPage>
	);
}
