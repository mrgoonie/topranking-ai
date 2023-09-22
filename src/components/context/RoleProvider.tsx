import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import React, { useContext, useEffect } from "react";

import { useStorage } from "@/components/context/StorageProvider";
import { api } from "@/plugins/trpc/api";

type RoleContextType = {};

export const RoleContext = React.createContext<RoleContextType | null>(null);

export interface IRoleProvider {
	children?: React.ReactNode;
	roles?: Array<string>;
}

const RoleProvider: React.FC<IRoleProvider> = ({ children, roles }) => {
	const { user } = useStorage();
	const router = useRouter();
	const { data: session, status } = useSession();

	const { data: userRoles, refetch } = api.user.getRole.useQuery(
		undefined, // no input
		{ enabled: session?.user !== undefined }
	);
	useEffect(() => {
		// effect

		if (!user) return;
		if (!roles) return;

		const allowRoles = new Set(["Admin", ...roles]);

		const _list = userRoles?.filter((item: any) => allowRoles.has(item.name)) || [];
		if (_list?.length > 0) {
			//
		} else {
			//
			console.log("cút");
			router.back();
		}

		// console.log("userRoles :>> ", userRoles);
		// console.log("user :>> ", user);

		return () => {};
	}, [JSON.stringify(user)]);

	return <RoleContext.Provider value={{}}>{children}</RoleContext.Provider>;
};

export default RoleProvider;

export const useRole = () => {
	const context = useContext(RoleContext);
	if (!context) {
		throw new Error("useRole has to be used within <RoleContext.Provider>");
	}
	return context;
};
