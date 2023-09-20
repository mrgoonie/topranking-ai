import { DoubleRightOutlined } from "@ant-design/icons";

import RankList from "@/components/theme/RankList";

import SiteButton from "./SiteButton";

const RankTable = () => {
	return (
		<div className="w-full max-w-3xl">
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
					{
						title: "Ultimate Free Online Teleprompter",
						desc: "Speak with confidence, no one will know there's a script",
						hashtags: ["#marketing", "#productivity", "#seo"],
					},
					{
						title: "Ultimate Free Online Teleprompter",
						desc: "Speak with confidence, no one will know there's a script",
						hashtags: ["#marketing", "#productivity", "#seo"],
					},
					{
						title: "Ultimate Free Online Teleprompter",
						desc: "Speak with confidence, no one will know there's a script",
						hashtags: ["#marketing", "#productivity", "#seo"],
					},
					{
						title: "Ultimate Free Online Teleprompter",
						desc: "Speak with confidence, no one will know there's a script",
						hashtags: ["#marketing", "#productivity", "#seo"],
					},
					{
						title: "Ultimate Free Online Teleprompter",
						desc: "Speak with confidence, no one will know there's a script",
						hashtags: ["#marketing", "#productivity", "#seo"],
					},
					{
						title: "Ultimate Free Online Teleprompter",
						desc: "Speak with confidence, no one will know there's a script",
						hashtags: ["#marketing", "#productivity", "#seo"],
					},
					{
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
			<div className="py-10 text-center">
				<SiteButton type="tertiary" leadIcon={<DoubleRightOutlined className="rotate-90" />}>
					Show more
				</SiteButton>
			</div>
		</div>
	);
};

export default RankTable;
