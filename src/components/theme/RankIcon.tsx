import Link from "next/link";
import type { ReactNode } from "react";
import React from "react";

import type { BaseComponentProps } from "./ComponentProps";

export interface IconBtnProps extends BaseComponentProps {
	value: string;
	active?: boolean;
	href?: string;
	target?: React.HTMLAttributeAnchorTarget;
	type?: "primary" | "secondary" | "tertiary" | "ghost" | "glass";
	size?: "lg" | "md" | "sm";
}

const RankIcon = (props?: IconBtnProps) => {
	const type = props?.type || "primary";
	const bgClasses =
		type === "primary"
			? "bg-lime-200 hover:bg-lime-100 [&.active]:bg-lime-100"
			: type === "tertiary"
			? "bg-neutral-800 hover:bg-neutral-700 [&.active]:bg-neutral-700"
			: type === "secondary"
			? "border-[3px] border-electric-green hover:border-electric-green-hover [&.active]:border-electric-green-hover"
			: type === "glass"
			? "glass-btn hover:bg-[#d7eded]/[.1] [&.active]:bg-[#d7eded]/[.1]"
			: "";
	const textClasses =
		type === "primary"
			? "text-slate-900"
			: type === "secondary"
			? "text-electric-green group-hover:text-electric-green-hover group-[.active]:text-electric-green-hover"
			: type === "tertiary"
			? "group-hover:text-neutral-300 group-[.active]:text-neutral-300"
			: type === "ghost"
			? "text-neutral-500 group-hover:text-neutral-400 group-[.active]:text-neutral-400"
			: type === "glass"
			? "text-neutral-400 group-hover:text-neutral-300 group-[.active]:text-neutral-300"
			: "";

	const linkWrapper = (children: ReactNode) =>
		props?.href ? (
			<Link href={props.href} target={props.target} className="inline-flex">
				{children}
			</Link>
		) : (
			children
		);

	return linkWrapper(
		<div
			className={[
				props?.active ? "active" : "",
				`group transition-all w-[52px] h-[52px] rounded-xl justify-center items-center gap-3 inline-flex`,
				bgClasses,
			].join(" ")}
		>
			<div
				className={`flex flex-col items-center text-base font-semibold leading-normal tracking-tight transition-all ${textClasses}`}
			>
				{props?.value}
				{props?.children}
			</div>
		</div>
	);
};

export default RankIcon;
