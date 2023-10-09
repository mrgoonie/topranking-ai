import Link from "next/link";
import type { ReactNode } from "react";
import React from "react";

import type { BaseComponentProps } from "./ComponentProps";

export interface CategoryBtnProps extends BaseComponentProps {
	active?: boolean;
	href?: string;
	target?: React.HTMLAttributeAnchorTarget;
	leadIcon?: ReactNode;
	trailIcon?: ReactNode;
	size?: "lg" | "md" | "sm";
	onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const CategoryButton = (props?: CategoryBtnProps) => {
	const linkWrapper = (children: ReactNode) =>
		props?.href ? (
			<Link href={props.href} target={props.target} className={props?.active ? "active" : ""}>
				{children}
			</Link>
		) : (
			<>{children}</>
		);

	return linkWrapper(
		<div
			className={`${
				props?.active ? "active" : ""
			} group relative flex h-8 cursor-pointer items-center gap-2 overflow-hidden rounded-xl border border-solid border-white border-opacity-10  p-3 transition-all hover:border-t hover:border-[rgba(255,_255,_255,_0.08)] hover:border-x-transparent hover:border-b-transparent [&.active]:border-t [&.active]:border-[rgba(255,_255,_255,_0.08)] [&.active]:border-x-transparent [&.active]:border-b-transparent`}
			style={{
				background: "linear-gradient(145deg, rgb(215, 237, 237, 0.16) 0%, rgba(204, 235, 235, 0.00) 100%)",
			}}
			onClick={props?.onClick}
		>
			<div className="absolute -bottom-[20px] -left-[20px] h-10 w-10 rounded-[50%] bg-electric-green opacity-0 blur filter transition-all group-hover:opacity-20 group-[.active]:opacity-20" />
			<div className="text-xs font-semibold leading-[18px] tracking-tight text-neutral-400 transition-all group-hover:text-green-400 group-[.active]:text-green-400">
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
			<div className="absolute -right-[11px] -top-[11px] h-[22px] w-[22px] rounded-[50%] bg-electric-green opacity-0 blur-lg filter transition-all group-hover:opacity-25 group-[.active]:opacity-25" />
		</div>
	);
};

export default CategoryButton;
