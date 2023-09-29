import { GoogleOutlined } from "@ant-design/icons";

import { useUser } from "../context/UserProvider";
import GradientHeading from "./GradientHeading";
import SiteButton from "./SiteButton";

const LoginPanel = () => {
	const { status, onSignInGoogle } = useUser();

	return (
		<div className="relative min-h-[413px] w-full max-w-[780px] overflow-hidden rounded-[20px] bg-neutral-950 p-16">
			<div className="inline-flex w-full max-w-[686px] flex-col items-center justify-start gap-10 ">
				<GradientHeading>Sign In</GradientHeading>
				<div className="h-[0px] w-[60px] border border-neutral-700"></div>
				<div className="w-[686px] text-center">
					<span className="font-['Plus Jakarta Sans'] text-lg font-bold leading-7 tracking-tight text-lime-300">
						TopRanking.AI
					</span>
					<span className="font-['Plus Jakarta Sans'] text-lg font-normal leading-7 tracking-tight">
						{" "}
						surfaces the best new AI products, every day.
						<br />
						It&apos;s a place for AI-loving enthusiasts to share and geek out about the latest AI apps,
						SaaS, virtual assistants, generative AI and AI creations.
					</span>
				</div>
				<div>
					<SiteButton fullWidth leadIcon={<GoogleOutlined />} onClick={() => onSignInGoogle()}>
						Sign-in with Google
					</SiteButton>
				</div>
			</div>
		</div>
	);
};

export default LoginPanel;
