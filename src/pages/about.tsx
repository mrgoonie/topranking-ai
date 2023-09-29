import MasterPageAuth from "@/components/layouts/MasterPageAuth";
import GradientHeading from "@/components/theme/GradientHeading";
import SiteLayout from "@/components/theme/SiteLayout";

export default function About() {
	return (
		<MasterPageAuth meta={{ title: "About" }}>
			<SiteLayout>
				<div className="grow" />
				<div className="relative min-h-[413px] w-full max-w-[780px] overflow-hidden rounded-[20px] bg-neutral-950 p-16">
					<div className="inline-flex w-full max-w-[686px] flex-col items-center justify-start gap-10 ">
						<GradientHeading>
							About
							<br />
							TopRanking.AI
						</GradientHeading>
						<div className="h-[0px] w-[60px] border border-neutral-700"></div>
						<div className="prose prose-neutral w-[686px] text-center dark:prose-invert lg:prose-xl">
							<p>
								<span className="font-['Plus Jakarta Sans'] text-lg font-bold leading-7 tracking-tight text-lime-300">
									TopRanking.AI
								</span>
								<span className="font-['Plus Jakarta Sans'] text-lg font-normal leading-7 tracking-tight">
									{" "}
									surfaces the best new AI products, every day.
									<br />
									It&apos;s a place for AI-loving enthusiasts to share and geek out about the latest
									AI apps, SaaS, virtual assistants, generative AI and AI creations.
								</span>
							</p>
							<p className="text-sm text-neutral-600">
								<em>
									Author:{" "}
									<a
										className="text-electric-green"
										href="https://twitter.com/goon_nguyen"
										rel="dofollow"
										target="_blank"
									>
										Mr.Goon
									</a>
								</em>
							</p>
						</div>
					</div>
				</div>
			</SiteLayout>
		</MasterPageAuth>
	);
}
