import { ArrowRightOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Input } from "antd";

import MasterPageAuth from "@/components/layouts/MasterPageAuth";
import GradientHeading from "@/components/theme/GradientHeading";
import SiteButton from "@/components/theme/SiteButton";
import SiteLayout from "@/components/theme/SiteLayout";

export default function Submit() {
	return (
		<MasterPageAuth meta={{ title: "Submit your AI" }}>
			<SiteLayout>
				<div className="grow" />
				<div className="relative flex min-h-[413px] w-full flex-row overflow-hidden rounded-[20px] bg-neutral-950">
					<div className="flex-grow">
						<div className="inline-flex w-full flex-col items-center justify-start gap-6 p-16">
							<GradientHeading>Submit an AI product</GradientHeading>
							<div className="mb-10 w-[686px] text-center">
								Found a cool AI product you want everyone to know about? Or maybe you made one yourself
								and want the world to know about it? You&apos;re in the right place.
							</div>
							<div className="flex w-full max-w-lg flex-row gap-4 ">
								<Input placeholder="www.example.com" prefix="https://" size="large" />
								<SiteButton leadIcon={<ArrowRightOutlined />} href="/submit-success">
									Submit
								</SiteButton>
							</div>
							<div className="inline-flex max-w-lg gap-3 text-sm">
								<InfoCircleOutlined />
								<p>
									{" "}
									We use AI to extract information from this website to categorize it, please make
									sure your website contains enough information.
								</p>
							</div>
						</div>
					</div>
					<div
						className="w-1/3 bg-cover bg-no-repeat"
						style={{ backgroundImage: `url(/images/illustration-01.png)` }}
					/>
				</div>
			</SiteLayout>
		</MasterPageAuth>
	);
}
