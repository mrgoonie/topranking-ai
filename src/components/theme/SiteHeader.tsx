import { SearchOutlined } from "@ant-design/icons";
import { Image, Input } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";

import { useUser } from "../context/UserProvider";
import type { BaseComponentProps } from "./ComponentProps";
import SiteButton from "./SiteButton";
import SiteLogo from "./SiteLogo";

interface SiteHeaderProps extends BaseComponentProps {}

const SiteHeader = (props?: SiteHeaderProps) => {
	const router = useRouter();
	const { user, onSignInGoogle } = useUser();
	// console.log("user :>> ", user);

	return (
		<div className="flex w-full items-center py-6">
			<div className="flex items-center gap-4">
				<SiteLogo href="/" wrapperStyle={{ width: `240px` }} />
				<Input prefix={<SearchOutlined />} size="large" placeholder="Search (Cmd + K)" />
				<SiteButton type="ghost" href="/about">
					About
				</SiteButton>
			</div>
			<div className="grow" />
			<div className="flex gap-4">
				<SiteButton
					type={user ? "glass" : "primary"}
					onClick={() => (user ? router.push("/submit") : onSignInGoogle())}
				>
					Submit AI
				</SiteButton>

				{user ? (
					<div className="flex flex-row items-center gap-2">
						<Image
							className="overflow-hidden rounded-2xl"
							preview={false}
							width={48}
							height={48}
							src={user.image || ""}
							alt="user avatar"
							referrerPolicy="no-referrer"
						/>
						{/* <Avatar size={48} src={user.image} alt="user avatar" referrerpolicy="no-referrer" /> */}
						<div className="flex flex-col items-start">
							<h2 className="font-bold text-white">{user.name}</h2>
							<Link
								href="/logout"
								className="text-sm text-electric-green transition-colors hover:text-electric-green-hover"
							>
								Sign out
							</Link>
						</div>
					</div>
				) : null}
			</div>
		</div>
	);
};

export default SiteHeader;
