import { HomeOutlined } from "@ant-design/icons";
import { Inter } from "next/font/google";

import MasterPage from "@/components/layouts/MasterPage";
import CategoryBtn from "@/components/theme/CategoryBtn";
import SiteHeader from "@/components/theme/SiteHeader";
import ThemeButton from "@/components/theme/ThemeButton";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	return (
		<MasterPage meta={{ title: "Home" }}>
			<main className={`flex min-h-screen w-full max-w-[1180px] flex-col items-center ${inter.className}`}>
				<SiteHeader />
				<CategoryBtn>Test</CategoryBtn>

				<div className="flex gap-1">
					<div>
						<ThemeButton href="https://google.com" target="_blank">
							Google
						</ThemeButton>
						<ThemeButton type="secondary">About Us</ThemeButton>
						<ThemeButton type="tertiary">About Us</ThemeButton>
						<ThemeButton type="ghost">About Us</ThemeButton>
						<ThemeButton type="glass">About Us</ThemeButton>
					</div>
					<div>
						<ThemeButton leadIcon={<HomeOutlined />}>About Us</ThemeButton>
						<ThemeButton leadIcon={<HomeOutlined />} type="secondary">
							About Us
						</ThemeButton>
						<ThemeButton leadIcon={<HomeOutlined />} type="tertiary">
							About Us
						</ThemeButton>
						<ThemeButton leadIcon={<HomeOutlined />} type="ghost">
							About Us
						</ThemeButton>
						<ThemeButton leadIcon={<HomeOutlined />} type="glass">
							About Us
						</ThemeButton>
					</div>
					<div>
						<ThemeButton trailIcon={<HomeOutlined />}>About Us</ThemeButton>
						<ThemeButton trailIcon={<HomeOutlined />} type="secondary">
							About Us
						</ThemeButton>
						<ThemeButton trailIcon={<HomeOutlined />} type="tertiary">
							About Us
						</ThemeButton>
						<ThemeButton trailIcon={<HomeOutlined />} type="ghost">
							About Us
						</ThemeButton>
						<ThemeButton trailIcon={<HomeOutlined />} type="glass">
							About Us
						</ThemeButton>
					</div>
				</div>
			</main>
		</MasterPage>
	);
}
