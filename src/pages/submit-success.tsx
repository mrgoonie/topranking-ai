import { HomeOutlined } from "@ant-design/icons";

import MasterPage from "@/components/layouts/MasterPage";
import GradientHeading from "@/components/theme/GradientHeading";
import SiteButton from "@/components/theme/SiteButton";

export default function Submit() {
	return (
		<MasterPage meta={{ title: "Submit your AI" }}>
			<div className="grow" />
			<div className="relative flex min-h-[413px] w-full flex-row overflow-hidden rounded-[20px] bg-neutral-950">
				<div className="flex-grow">
					<div className="inline-flex w-full flex-col items-center justify-start gap-6 p-16">
						<GradientHeading>Thank you!</GradientHeading>
						<div className="mb-10 w-full max-w-lg text-center">
							Your submission is under review and will be listed
							<br /> on the leaderboard soon.
						</div>
						<div className="flex w-full max-w-lg items-stretch">
							<SiteButton href="/" leadIcon={<HomeOutlined />} fullWidth>
								Home
							</SiteButton>
						</div>
					</div>
				</div>
				<div
					className="w-1/3 bg-cover bg-no-repeat"
					style={{ backgroundImage: `url(/images/illustration-02.png)` }}
				/>
			</div>
		</MasterPage>
	);
}
