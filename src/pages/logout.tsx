// import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { useEffect } from "react";

import MasterPageAuth from "@/components/layouts/MasterPageAuth";

const UILogout = dynamic(() => import("@/components/router/UILogout"), { ssr: false });

const Index = () => {
	const router = useRouter();

	useEffect(() => {
		// effect

		(async () => {
			signOut({ redirect: false });

			router.push("/");
		})();
		return () => {};
	}, []);

	return (
		<>
			<style global jsx>{`
				html,
				body {
					background-color: black;
					color: white;
				}
			`}</style>

			<MasterPageAuth
				meta={{
					title: "Trang Chủ",
					description: "diginext13",
				}}
			>
				<UILogout />
			</MasterPageAuth>
		</>
	);
};

export default Index;

export const getServerSideProps = async ({ req, res, query }: any) => {
	// Clear the cookie
	res.setHeader("Set-Cookie", "next-auth.session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;");

	return {
		props: {},
	};
};
