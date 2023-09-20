import dynamic from "next/dynamic";

import MasterPageAuth from "@/components/layouts/MasterPageAuth";

const PageLogin = dynamic(() => import("@/components/router/examples/PageLogin"), { ssr: false });
// /login
const Login = (props: any) => {
	return (
		<>
			<MasterPageAuth meta={{ title: "Login" }} {...props}>
				<PageLogin {...props} />
			</MasterPageAuth>
		</>
	);
};

export default Login;
