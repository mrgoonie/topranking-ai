/* eslint-disable import/extensions */

import Compose from "@/components/context/compose/Compose";
import RoleProvider from "@/components/context/RoleProvider";
import UserProvider from "@/components/context/UserProvider";

const ProvidersAuth = (props: any) => {
	return (
		<Compose
			components={[
				//
				UserProvider,
				RoleProvider,
			]}
			basePath={`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth`}
			clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
			{...props}
		></Compose>
	);
};

export default ProvidersAuth;
