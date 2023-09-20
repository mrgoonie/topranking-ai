import Link from "next/link";
import type { ReactNode } from "react";
import React from "react";

import type { BaseComponentProps } from "./ComponentProps";

export interface BtnProps extends BaseComponentProps {
	active?: boolean;
	href?: string;
	target?: React.HTMLAttributeAnchorTarget;
	type?: "primary" | "secondary" | "tertiary" | "ghost" | "glass";
	leadIcon?: ReactNode;
	trailIcon?: ReactNode;
	size?: "lg" | "md" | "sm";
}

const ThemeButton = (props?: BtnProps) => {
	const type = props?.type || "primary";
	const bgClasses =
		type === "primary"
			? "bg-lime-200 hover:bg-lime-100"
			: type === "tertiary"
			? "bg-zinc-900 hover:bg-neutral-700"
			: type === "secondary"
			? "border-[3px] border-electric-green hover:border-electric-green-hover"
			: type === "glass"
			? "glass-btn hover:bg-[#d7eded]/[.1]"
			: "";
	const textClasses =
		type === "primary"
			? "text-slate-900"
			: type === "secondary"
			? "text-electric-green group-hover:text-electric-green-hover"
			: type === "tertiary"
			? "hover:text-neutral-300"
			: type === "ghost"
			? "text-neutral-500 group-hover:text-neutral-400"
			: type === "glass"
			? "text-neutral-400 group-hover:text-neutral-300"
			: "";

	const linkWrapper = (children: ReactNode) =>
		props?.href ? (
			<Link href={props.href} target={props.target}>
				{children}
			</Link>
		) : (
			children
		);

	return linkWrapper(
		<div
			className={[
				`group transition-all cursor-pointer px-6 py-3 rounded-xl justify-center items-center gap-3 inline-flex`,
				bgClasses,
			].join(" ")}
		>
			<div className={`text-base font-semibold leading-normal tracking-tight transition-all ${textClasses}`}>
				{props?.leadIcon ? (
					<>
						{props?.leadIcon}
						<span className="inline-block w-2" />
					</>
				) : null}
				{props?.children}
				{props?.trailIcon ? (
					<>
						<span className="inline-block w-2" />
						{props?.trailIcon}
					</>
				) : null}
			</div>
		</div>
	);
};

export default ThemeButton;
