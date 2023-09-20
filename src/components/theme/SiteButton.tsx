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
	fullWidth?: boolean;
	onClick?: () => void;
}

const SiteButton = (props?: BtnProps) => {
	const type = props?.type || "primary";
	const bgClasses =
		type === "primary"
			? "border-[3px] border-lime-200 bg-lime-200 hover:bg-lime-100 [&.active]:bg-lime-100"
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
			? "group-hover:text-neutral-300"
			: type === "ghost"
			? "text-neutral-500 group-hover:text-neutral-400 group-[.active]:text-neutral-400"
			: type === "glass"
			? "text-neutral-400 group-hover:text-neutral-300 group-[.active]:text-neutral-300"
			: "";

	const linkWrapper = (children: ReactNode) =>
		props?.href ? (
			<Link
				href={props.href}
				target={props.target}
				className={`inline-flex ${props?.fullWidth ? "flex flex-grow" : ""}`}
			>
				{children}
			</Link>
		) : (
			children
		);

	return linkWrapper(
		<div
			className={[
				props?.active ? "active" : "",
				props?.fullWidth ? "flex flex-grow" : "",
				`group transition-all cursor-pointer box-border px-6 py-3 rounded-xl justify-center items-center gap-3 inline-flex`,
				bgClasses,
			].join(" ")}
		>
			<div
				className={`inline-flex text-base font-semibold leading-normal tracking-tight transition-all ${textClasses}`}
				onClick={props?.onClick}
			>
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

export default SiteButton;
